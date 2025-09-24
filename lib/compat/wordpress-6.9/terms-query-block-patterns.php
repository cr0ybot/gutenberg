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
			'term-query-cat-descriptions' => array(
				'title'      => _x( 'Category Descriptions', 'Block pattern title' ),
				'blockTypes' => array( 'core/terms-query' ),
				'categories' => array( 'query' ),
				'content'    => '<!-- wp:terms-query -->
					<div class="wp-block-terms-query">
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"2.5rem"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
					<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap","justifyContent":"stretch"}} -->
					<div class="wp-block-group">
					<!-- wp:heading {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"name"}}}}} -->
					<h2 class="wp-block-heading"></h2>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"description"}}}}} -->
					<p></p>
					<!-- /wp:paragraph -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}}}}} -->
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">' . _x( 'View posts', 'Block pattern button text' ) . '</a></div>
					<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
					</div>
					<!-- /wp:group -->
					<!-- /wp:term-template -->
					</div>
					<!-- /wp:terms-query -->',
			),
			'term-query-cat-children'     => array(
				'title'      => _x( 'Category Children', 'Block pattern title' ),
				'blockTypes' => array( 'core/terms-query' ),
				'categories' => array( 'query' ),
				'content'    => '<!-- wp:terms-query -->
					<div class="wp-block-terms-query">
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"2.5rem"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
					<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","flexWrap":"nowrap","justifyContent":"stretch"}} -->
					<div class="wp-block-group">
					<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
					<div class="wp-block-group">
					<!-- wp:heading {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"name"}}}}} -->
					<h2 class="wp-block-heading"></h2>
					<!-- /wp:heading -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}}}}} -->
					<div class="wp-block-button">
					<a class="wp-block-button__link wp-element-button">' . _x( 'View posts', 'Block pattern button text' ) . '</a>
					</div>
					<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
					</div>
					<!-- /wp:group -->
					<!-- wp:terms-query {"termQuery":{"inherit":true}} -->
					<div class="wp-block-terms-query">
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"1rem"}},"layout":{"type":"flex","orientation":"horizontal","justifyContent":"left","flexWrap":"wrap"}} -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}},"text":{"source":"core/term-data","args":{"key":"name"}}}},"className":"is-style-outline"} -->
					<div class="wp-block-button is-style-outline">
					<a class="wp-block-button__link wp-element-button">' . _x( 'Subcategory', 'Block pattern button text' ) . '</a>
					</div>
					<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
					<!-- /wp:term-template -->
					</div>
					<!-- /wp:terms-query -->
					</div>
					<!-- /wp:group -->
					<!-- /wp:term-template -->
					</div>
					<!-- /wp:terms-query -->',
			),
			'term-query-tag-links'        => array(
				'title'      => _x( 'Tag Links', 'Block pattern title' ),
				'blockTypes' => array( 'core/terms-query' ),
				'categories' => array( 'query' ),
				'content'    => '<!-- wp:terms-query {"termQuery":{"taxonomy":"post_tag","hideEmpty":true}} -->
					<div class="wp-block-terms-query">
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"1rem"}},"layout":{"type":"flex","orientation":"horizontal","justifyContent":"left","flexWrap":"wrap"}} -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}},"text":{"source":"core/term-data","args":{"key":"name"}}}}} -->
					<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">' . _x( 'Tag', 'Block pattern button text' ) . '</a></div>
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
