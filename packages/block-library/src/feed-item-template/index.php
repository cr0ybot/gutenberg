<?php
/**
 * Server-side rendering of the `core/feed-item-template` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/feed-item-template` block on the server.
 *
 * @since 6.9.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the output of the feed, structured using the layout defined by the block's inner blocks.
 */
function render_block_core_feed_item_template( $attributes, $content, $block ) {
	// To do: get feed.
	$feed = array();

	if ( is_wp_error( $feed ) ) {
		if ( WP_DEBUG ) {
			error_log( 'Feed Loop: ' . $feed->get_error_message() . " ({$block->context['feedUrl']})" ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
		return;
	}

	if ( empty( $feed['items'] ) ) {
		if ( WP_DEBUG ) {
			error_log( 'Feed Loop: No items found in feed ' . " ({$block->context['feedUrl']})" ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
		return;
	}

	$classnames = 'wp-block-feed-item-template';

	if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
		$classnames .= ' has-link-color';
	}

	$wrapper_attributes = \get_block_wrapper_attributes( array( 'class' => $classnames ) );

	$content = '';

	// Get the number of items available.
	$item_count = count( $feed['items'] );

	// Loop through the items to be displayed.
	for ( $i = 0; $i < $block->context['itemsToShow'] && $i < $item_count; $i++ ) {
		$item = $feed['items'][ $i ];

		// Get an instance of the current Feed Item Template block.
		$block_instance = $block->parsed_block;

		// Set the block name to one that does not correspond to an existing registered block.
		// This ensures that for the inner instances of the Feed Item Template block, we do not render any block supports.
		$block_instance['blockName'] = 'core/null';

		$filter_block_context = static function ( $context ) use ( $item ) {
			$context['feedItem'] = $item;
			return $context;
		};

		// Use an early priority to so that other 'render_block_context' filters have access to the values.
		add_filter( 'render_block_context', $filter_block_context, 1 );
		// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
		// `render_callback` and ensure that no wrapper markup is included.
		$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
		remove_filter( 'render_block_context', $filter_block_context, 1 );

		// Wrap the render inner blocks in a `li` element with the appropriate post classes.
		$item_classes = 'wp-block-feed-item';

		$content .= sprintf( '<li class="%s">%s</li>', esc_attr( $item_classes ), $block_content );
	}

	return sprintf(
		'<ul %1$s>%2$s</ul>',
		$wrapper_attributes,
		$content
	);
}

/**
 * Registers the `core/feed-item-template` block on the server.
 *
 * @since 6.9.0
 */
function register_block_core_feed_item_template() {
	register_block_type_from_metadata(
		__DIR__ . '/feed-item-template',
		array(
			'render_callback'   => 'render_block_core_feed_item_template',
			'skip_inner_blocks' => true,
		)
	);
}
add_action( 'init', 'register_block_core_feed_item_template' );
