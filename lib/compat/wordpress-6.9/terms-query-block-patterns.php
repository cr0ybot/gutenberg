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
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
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
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}}}},"className":"is-style-fill"} -->
					<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">View posts</a></div>
					<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
					</div>
					<!-- /wp:group -->
					<!-- /wp:term-template -->
					</div>
					<!-- /wp:terms-query -->',
			),
			'term-query-cat-list'         => array(
				'title'      => _x( 'Category List', 'Block pattern title' ),
				'blockTypes' => array( 'core/terms-query' ),
				'categories' => array( 'query' ),
				'content'    => '<!-- wp:terms-query {"termQuery":{"taxonomy":"category","hierarchical":true}} -->
					<div class="wp-block-terms-query">
					<!-- wp:term-template {"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch","flexWrap":"nowrap"}} -->
					<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left","verticalAlignment":"center"}} -->
					<div class="wp-block-group">
					<!-- wp:buttons {"layout":{"type":"flex","verticalAlignment":"center"}} -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}},"text":{"source":"core/term-data","args":{"key":"name"}}}},"className":"is-style-outline","style":{"spacing":{"padding":{"left":"0","right":"0","top":"0","bottom":"0"}},"border":{"color":"#00000000","radius":{"topLeft":"0px","topRight":"0px","bottomLeft":"0px","bottomRight":"0px"}}}} -->
					<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-border-color wp-element-button" style="border-color:#00000000;border-top-left-radius:0px;border-top-right-radius:0px;border-bottom-left-radius:0px;border-bottom-right-radius:0px;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">View posts</a></div>
					<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
					<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"core/term-data","args":{"key":"count"}}}},"fontSize":"medium"} -->
					<p class="has-medium-font-size"></p>
					<!-- /wp:paragraph -->
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
					<!-- wp:term-template {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","orientation":"horizontal","justifyContent":"left","flexWrap":"wrap"}} -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
					<!-- wp:button {"metadata":{"bindings":{"url":{"source":"core/term-data","args":{"key":"link"}},"text":{"source":"core/term-data","args":{"key":"name"}}}},"className":"is-style-outline","style":{"spacing":{"padding":{"left":"var:preset|spacing|30","right":"var:preset|spacing|30","top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"fontSize":"small"} -->
					<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-small-font-size has-custom-font-size wp-element-button" style="padding-top:var(--wp--preset--spacing--20);padding-right:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--30)"></a></div>
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
