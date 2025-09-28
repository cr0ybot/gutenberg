<?php
/**
 * Server-side rendering of the `core/feed` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/feed` block on the server.
 *
 * @since 6.9.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the modified output of the feed block.
 */
function render_block_core_feed( $attributes, $content, $block ) {
	// To do: filter all link elements to handle openInNewTab and rel attribtues.
	return $content;
}

/**
 * Registers the `core/feed` block on the server.
 *
 * @since 6.9.0
 */
function register_block_core_feed() {
	register_block_type_from_metadata(
		__DIR__ . '/feed',
		array(
			'render_callback'   => 'render_block_core_feed',
			'skip_inner_blocks' => true,
		)
	);
}
add_action( 'init', 'register_block_core_feed' );
