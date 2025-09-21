<?php
/**
 * Server-side rendering of the `core/term-template` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/term-template` block on the server.
 *
 * @since 6.9.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the output of the term template.
 */
function render_block_core_term_template( $attributes, $content, $block ) {
	if ( ! isset( $block->context ) || ! isset( $attributes ) ) {
		return '';
	}

	$query_block_context = $block->context;

	if ( empty( $query_block_context['termQuery'] ) ) {
		return '';
	}

	$query      = $query_block_context['termQuery'];
	$query_args = gutenberg_build_query_vars_from_terms_query_block( $block, 2 );

	// Use terms from post context if needed.
	$inherit_from_post = (
		isset( $block->context['query']['inherit'] )
		&& $block->context['query']['inherit']
		&& isset( $block->context['postId'] )
	);

	if ( $inherit_from_post ) {
		// Collect a subset of args from the query.
		$post_query_args = array(
			'number'       => $query_args['number'],
			'order'        => $query_args['order'],
			'orderby'      => $query_args['orderby'],
			'hide_empty'   => $query_args['hide_empty'],
			'hierarchical' => $query_args['hierarchical'],
		);
		$terms           = wp_get_post_terms( $block->context['postId'], $query['taxonomy'], $post_query_args );
	} else {
		$terms_query = new WP_Term_Query( $query_args );
		$terms       = $terms_query->get_terms();
	}

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}

	// Handle hierarchical list.
	$is_hierarchical = ! empty( $query['hierarchical'] );

	if ( $is_hierarchical ) {
		$content = render_block_core_term_template_hierarchical( $terms, $block );
	} else {
		$content = render_block_core_term_template_flat( $terms, $block );
	}

	$classnames = 'wp-block-term-template';

	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classnames .= ' has-link-color';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => trim( $classnames ) ) );

	// Default list layout.
	return sprintf(
		'<ul %s>%s</ul>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Renders terms in a flat list structure.
 *
 * @since 6.9.0
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 *
 * @return string HTML content for flat terms list.
 */
function render_block_core_term_template_flat( $terms, $block ) {
	$content = '';
	foreach ( $terms as $term ) {
		$content .= render_block_core_term_template_single( $term, $block );
	}
	return $content;
}

/**
 * Builds a hierarchical tree of terms.
 *
 * Note: this looks at every term in the array for every level of depth, is
 * there a better way to do this?
 *
 * @since 6.9.0
 *
 * @param WP_Term[] $terms Array of WP_Term objects.
 * @param integer   $parent_id Current parent term ID.
 *
 * @return WP_Term[] Array of WP_Term objects in a hierarchical structure.
 */
function build_term_tree( $terms, $parent_id = 0 ) {
	$tree = array();
	foreach ( $terms as $term ) {
		if ( $term->parent === $parent_id ) {
			$children = build_term_tree( $terms, $term->term_id );
			if ( ! empty( $children ) ) {
				$term->children = $children;
			} else {
				$term->children = array();
			}
			$tree[] = $term;
		}
	}
	return $tree;
}

/**
 * Renders terms in a hierarchical structure.
 *
 * @since 6.9.0
 *
 * @param array    $terms Array of WP_Term objects.
 * @param WP_Block $block Block instance.
 *
 * @return string HTML content for hierarchical terms list.
 */
function render_block_core_term_template_hierarchical( $terms, $block ) {
	$content = '';

	// Note the "root" term ID.
	$root = 0;
	if (
		isset( $block->context['termQuery'] )
		&& ! empty( $block->context['termQuery']['parent'] )
	) {
		$root = absint( $block->context['termQuery']['parent'] );
	}

	$tree = build_term_tree( $terms, $root );

	foreach ( $tree as $term ) {
		$children_content = render_block_core_term_template_children( $term->children, $block );
		$term_content     = render_block_core_term_template_single( $term, $block, $children_content );

		$content .= $term_content;
	}

	return $content;
}

/**
 * Renders children of a specific term.
 *
 * @since 6.9.0
 *
 * @param array    $terms Array of arrays with 'term' and 'children' keys.
 * @param WP_Block $block          Block instance.
 *
 * @return string HTML content for children terms.
 */
function render_block_core_term_template_children( $terms, $block ) {
	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return '';
	}

	$content = '<ul>';

	foreach ( $terms as $child_term ) {

		if ( ! $child_term instanceof WP_Term ) {
			continue;
		}

		// Render children first in order to insert into the parent term render.
		$children_content = render_block_core_term_template_children( $child_term->children, $block );
		$term_content     = render_block_core_term_template_single( $child_term, $block, $children_content );

		$content .= $term_content;
	}

	$content .= '</ul>';

	return $content;
}

/**
 * Renders a single term with its inner blocks.
 *
 * @since 6.9.0
 *
 * @param WP_Term  $term  Term object.
 * @param WP_Block $block Block instance.
 * @param string   $children_content HTML content for child terms, if any.
 *
 * @return string HTML content for a single term.
 */
function render_block_core_term_template_single( $term, $block, $children_content = '' ) {
	$inner_blocks  = $block->inner_blocks;
	$block_content = '';

	if ( ! empty( $inner_blocks ) ) {
		$term_id  = $term->term_id;
		$taxonomy = $term->taxonomy;

		$filter_block_context = static function ( $context ) use ( $term_id, $taxonomy ) {
			$context['termId']   = $term_id;
			$context['taxonomy'] = $taxonomy;
			return $context;
		};

		add_filter( 'render_block_context', $filter_block_context, 1 );

		foreach ( $inner_blocks as $inner_block ) {
			if ( method_exists( $inner_block, 'refresh_context_dependents' ) ) {
				// WP_Block::refresh_context_dependents() was introduced in WordPress 6.8.
				$inner_block->refresh_context_dependents();
				$block_content .= $inner_block->render( array( 'dynamic' => true ) );
			} else {
				$block_content = ( new WP_Block( $inner_block->parsed_block ) )->render( array( 'dynamic' => false ) );
			}
		}
		remove_filter( 'render_block_context', $filter_block_context, 1 );
	}

	$term_classes = implode( ' ', array( 'wp-block-term', 'term-' . $term->term_id ) );

	// Default list layout.
	return '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . $children_content . '</li>';
}

/**
 * Registers the `core/term-template` block on the server.
 *
 * @since 6.9.0
 */
function register_block_core_term_template() {
	register_block_type_from_metadata(
		__DIR__ . '/term-template',
		array(
			'render_callback' => 'render_block_core_term_template',
		)
	);
}
add_action( 'init', 'register_block_core_term_template' );
