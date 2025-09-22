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
	$query_args = gutenberg_build_query_vars_from_terms_query_block( $block );

	// Inherit by default if termId is available in context.
	$inherit      = isset( $block->context['query']['inherit'] ) ? $block->context['query']['inherit'] : isset( $block->context['termId'] );
	$inherit_from = 'none';

	// Inheritance order: block context, post context, taxonomy archive context.
	if ( $inherit && isset( $block->context['termId'] ) ) {
		$inherit_from = 'block';
	} elseif ( $inherit && isset( $block->context['postId'] ) ) {
		$inherit_from = 'post';
	} elseif ( $inherit && is_tax( $query_args['taxonomy'] ) ) {
		$inherit_from = 'taxonomy_archive';
	}

	if ( 'post' === $inherit_from ) {
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
		if ( 'block' === $inherit_from ) {
			// Get the parent term ID from the block context.
			$parent_term_id = $block->context['termId'];
			if ( $parent_term_id && $parent_term_id > 0 ) {
				$query_args['parent'] = $parent_term_id;
			}
		} elseif ( 'taxonomy_archive' === $inherit_from ) {
			// Get the current term ID from the queried object.
			$current_term_id = get_queried_object_id();
			if ( $current_term_id && $current_term_id > 0 ) {
				$query_args['parent'] = $current_term_id;
			}
		}

		$terms_query = new WP_Term_Query( $query_args );
		$terms       = $terms_query->get_terms();
	}

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}

	$content = '';
	foreach ( $terms as $term ) {
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

		$content .= '<li class="' . esc_attr( $term_classes ) . '">' . $block_content . '</li>';
	}

	$classnames = 'wp-block-term-template';

	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classnames .= ' has-link-color';
	}

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => trim( $classnames ) ) );

	return sprintf(
		'<ul %s>%s</ul>',
		$wrapper_attributes,
		$content
	);
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
