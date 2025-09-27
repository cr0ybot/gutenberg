/**
 * WordPress dependencies
 */

import { useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Notice,
	Placeholder,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { rss as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { prependHTTP } from '@wordpress/url';

export default function FeedPlaceholder( {
	attributes,
	setAttributes,
	onSubmitFeedUrl,
} ) {
	const { feedURL } = attributes;
	const [ notice, setNotice ] = useState( null );
	const siteUrl = useSelect(
		( select ) => select( coreStore ).getSite()?.url
	);
	const blockProps = useBlockProps();

	/**
	 * Ensure the URL is not from the same root as the site URL.
	 * @param {Event} event The submit event.
	 */
	const handleSubmitFeedUrl = ( event ) => {
		event.preventDefault();

		if ( ! feedURL ) {
			setNotice( __( 'Please enter a feed URL.' ) );
			return;
		}

		const normalizedFeedURL = prependHTTP( feedURL );

		// To do: check URLs with protocol stripped.
		if ( siteUrl && normalizedFeedURL.startsWith( siteUrl ) ) {
			setNotice(
				__(
					'Please enter a feed URL that is not from the current site.'
				)
			);
			return;
		}
		setNotice( null );
		setAttributes( { feedURL: normalizedFeedURL } );
		onSubmitFeedUrl();
	};

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ icon }
				label={ __( 'Feed Loop' ) }
				instructions={ __(
					'Display entries from any RSS or Atom feed.'
				) }
			>
				<form
					onSubmit={ handleSubmitFeedUrl }
					className="wp-block-feed__placeholder-form"
				>
					{ notice && (
						<Notice
							className="wp-block-feed__placeholder-notice"
							status="error"
							isDismissible={ false }
							politeness="assertive"
						>
							<p>{ notice }</p>
						</Notice>
					) }
					<InputControl
						__next40pxDefaultSize
						label={ __( 'Feed URL (RSS/Atom)' ) }
						type="url"
						hideLabelFromVision
						placeholder={ __( 'https://example.com/feed' ) }
						value={ feedURL }
						onChange={ ( value ) =>
							setAttributes( { feedURL: value } )
						}
						className="wp-block-feed__placeholder-input"
					/>
					<Button
						__next40pxDefaultSize
						variant="primary"
						type="submit"
					>
						{ __( 'Apply' ) }
					</Button>
				</form>
			</Placeholder>
		</div>
	);
}
