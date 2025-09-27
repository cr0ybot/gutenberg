/**
 * WordPress dependencies
 */
import { rss as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, Placeholder, InputControl } from '@wordpress/components';

export default function FeedPlaceholder( {
	attributes,
	setAttributes,
	onSubmitFeedURL,
} ) {
	const { feedURL } = attributes;
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<Placeholder icon={ icon } label={ __( 'Feed Loop' ) }>
				<form
					onSubmit={ onSubmitFeedURL }
					className="wp-block-feed__placeholder-form"
				>
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
