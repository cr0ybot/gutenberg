<?php
/**
 * Terms Query block patterns.
 *
 * @since 6.9.0
 * @package gutenberg
 * @subpackage Patterns
 */

/**
 * Registers block patterns for the Terms Query block.
 *
 * @since 6.9.0
 * @access private
 */
function gutenberg_terms_query_register_block_patterns() {
	$should_register_core_patterns = get_theme_support( 'core-block-patterns' );

	if ( $should_register_core_patterns ) {
		$term_query_block_patterns = array(
			'term-query-standard' => array(
				'title'      => _x( 'Standard Terms', 'Block pattern title' ),
				'blockTypes' => array( 'core/terms-query' ),
				'categories' => array( 'query' ),
				'content'    => '<!-- wp:terms-query -->
					<div class="wp-block-terms-query">
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
					<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
					<div class="wp-block-group">
					<!-- wp:heading {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"name"}}}}} -->
					<h2 class="wp-block-heading"></h2>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"count"}}}}} -->
					<p></p>
					<!-- /wp:paragraph -->
					</div>
					<!-- /wp:group -->
					<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"description"}}}}} -->
					<p></p>
					<!-- /wp:paragraph -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}}}},"className":"is-style-fill"} -->
					<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">View posts</a></div>
					<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
					<!-- /wp:term-template -->
					</div>
					<!-- /wp:terms-query -->',
			),
		);

		foreach ( $term_query_block_patterns as $name => $pattern ) {
			$pattern['source'] = 'core';
			register_block_pattern( 'core/' . $name, $pattern );
		}
	}
}

add_action( 'init', 'gutenberg_terms_query_register_block_patterns' );
