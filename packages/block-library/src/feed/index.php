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
 * Fetches an RSS feed and returns a JSONFeed-compatible array.
 *
 * @since 6.9.0
 *
 * @param string $url The RSS/Atom feed URL.
 * @return array|WP_Error The feed as a JSONFeed-compatible array, or a WP_Error on failure.
 */
function get_feed_as_json( $url ) {
	// Use cached json if available.
	$cached_json = wp_cache_get( $url, 'feed_json' );
	if ( false !== $cached_json ) {
		return $cached_json;
	}

	$feed = fetch_feed( $url );

	if ( is_wp_error( $feed ) ) {
		// Return the error object.
		return $feed;
	}

	/**
	 * Build an array in the format of JSONFeed v1.1.
	 *
	 * @link https://www.jsonfeed.org/version/1.1/
	 * @link https://www.jsonfeed.org/mappingrssandatom/
	 */
	$json = array(
		'version'       => 'https://jsonfeed.org/version/1.1',
		'title'         => $feed->get_title(),
		'description'   => $feed->get_description(),
		'feed_url'      => $feed->get_permalink(),
		'home_page_url' => $feed->get_base(),
		'icon'          => $feed->get_image_url(),
		'authors'       => array(),
		'language'      => $feed->get_language(),
		'items'         => array(),
	);

	// Populate authors, if any.
	$authors = $feed->get_authors();
	if ( ! empty( $authors ) ) {
		foreach ( $authors as $author ) {
			$json['authors'][] = array(
				'name'   => $author->get_name(),
				'url'    => $author->get_link(),
				'avatar' => $author->get_email() ? 'https://www.gravatar.com/avatar/' . md5( strtolower( trim( $author->get_email() ) ) ) : '',
			);
		}
	}

	// Populate items.
	$items = $feed->get_items();
	if ( ! empty( $items ) ) {
		foreach ( $items as $feed_item ) {
			$item = array(
				'id'             => $feed_item->get_id(),
				'url'            => $feed_item->get_permalink(),
				'title'          => wp_strip_all_tags(
					wp_specialchars_decode(
						$feed_item->get_title()
					)
				),
				'content_html'   => $feed_item->get_content(),
				'content_text'   => wp_specialchars_decode( wp_strip_all_tags( $feed_item->get_content() ) ),
				'summary'        => wp_specialchars_decode( wp_strip_all_tags( $feed_item->get_description() ) ),
				'authors'        => array(),
				'tags'           => array(),
				'image'          => '',
				// Note: JSONFeed specifies RFC 3339 date format, which overlaps with ISO 8601 and is compatible with the 'c' format in PHP.
				'date_published' => $feed_item->get_date( 'c' ),
				'date_modified'  => $feed_item->get_updated_date( 'c' ),
				// Extensions must be prefixed with an underscore.
				'_xmlns'         => array(), // Custom namespaced elements.
			);

			// Populate authors.
			$item_authors = $feed_item->get_authors();
			if ( ! empty( $item_authors ) ) {
				foreach ( $item_authors as $author ) {
					$item['authors'][] = array(
						'name'   => $author->get_name(),
						'url'    => $author->get_link(),
						'avatar' => $author->get_email() ? 'https://www.gravatar.com/avatar/' . md5( strtolower( trim( $author->get_email() ) ) ) : '',
					);
				}
			}

			// Populate tags.
			$item_categories = $feed_item->get_categories();
			if ( ! empty( $item_categories ) ) {
				foreach ( $item_categories as $category ) {
					$item['tags'][] = $category->get_label();
				}
			}

			// Populate custom namespaced elements.
			// NOTE: These are keyed by the namespace URL, not the namespace prefix.
			if ( ! empty( $feed_item->data['child'] ) && count( $feed_item->data['child'] ) > 1 ) {
				$custom = array_slice( $feed_item->data['child'], 1 );
				foreach ( $custom as $namespace => $namespace_items ) {
					$item['_wp_xmlns'][ $namespace ] = array_map(
						function ( $namespace_item ) {
							if ( ! empty( $namespace_item[0] ) && isset( $namespace_item[0]['data'] ) ) {
								return $namespace_item[0]['data'];
							}
							return '';
						},
						$namespace_items
					);
				}
			}

			// Check for itunes:image.
			$itunes_image = $feed_item->get_item_tags( SIMPLEPIE_NAMESPACE_ITUNES, 'image' );
			if ( ! empty( $itunes_image ) ) {
				$item['image'] = $itunes_image[0]['attribs']['']['href'];
			}

			if ( empty( $item['image'] ) ) {
				// Check for media:thumbnail.
				$media_thumbnail = $feed_item->get_item_tags( SIMPLEPIE_NAMESPACE_MEDIARSS, 'thumbnail' );
				if ( ! empty( $media_thumbnail ) ) {
					$item['image'] = $media_thumbnail[0]['attribs']['']['url'];
				}
			}

			// Add enclosures.
			$enclosures = $feed_item->get_enclosures();
			if ( ! empty( $enclosures ) ) {
				$item['attachments'] = array();
				foreach ( $enclosures as $enclosure ) {
					$item['attachments'][] = array(
						'url'                 => $enclosure->get_link(),
						'mime_type'           => $enclosure->get_type(),
						'title'               => $enclosure->get_title(),
						'size_in_bytes'       => $enclosure->get_length(),
						'duration_in_seconds' => $enclosure->get_duration(),
					);
				}
			}

			/**
			 * Filters the feed item array.
			 *
			 * @since 6.9.0
			 *
			 * @param array $item The feed item array.
			 * @param \SimplePie_Item $feed_item The feed item object.
			 * @return array
			 */
			$json['items'][] = apply_filters( 'feed_block_feed_item', $item, $feed_item );
		}
	}

	/**
	 * Filters the feed array.
	 *
	 * @since 6.9.0
	 *
	 * @param array $json The feed array.
	 * @param \SimplePie $feed The feed object.
	 * @return array
	 */
	$json = apply_filters( 'feed_block_feed', $json, $feed );

	// Cache the feed.
	wp_cache_set( $url, $json, 'feed_json' );

	return $json;
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
