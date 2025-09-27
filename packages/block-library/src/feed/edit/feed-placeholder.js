/**
 * WordPress dependencies
 */

import { useBlockProps } from '@wordpress/block-editor';
import {
	Button,
	Notice,
	Placeholder,
	InputControl,
} from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { rss as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

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
	 * @param {string} value The submitted feed URL value.
	 */
	const handleSubmitFeedUrl = ( value ) => {
		if ( siteUrl && value.startsWith( siteUrl ) ) {
			setNotice(
				__(
					'Please enter a feed URL that is not from the current site.'
				)
			);
			return;
		}
		setNotice( null );
		onSubmitFeedUrl( value );
	};

	return (
		<div { ...blockProps }>
			<Placeholder icon={ icon } label={ __( 'Feed Loop' ) }>
				<form
					onSubmit={ handleSubmitFeedUrl }
					className="wp-block-feed__placeholder-form"
				>
					{ notice && (
						<Notice
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
