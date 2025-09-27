/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { prependHTTP } from '@wordpress/url';

/**
 * Internal dependencies
 */
import FeedPlaceholder from './feed-placeholder';
import FeedContent from './feed-content';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { feedURL } = attributes;

	const [ isEditing, setIsEditing ] = useState( ! attributes.feedURL );

	const onSubmitFeedUrl = ( event ) => {
		event.preventDefault();

		if ( feedURL ) {
			setAttributes( { feedURL: prependHTTP( feedURL ) } );
			setIsEditing( false );
		}
	};

	if ( isEditing ) {
		return (
			<FeedPlaceholder { ...props } onSubmitFeedUrl={ onSubmitFeedUrl } />
		);
	}

	return <FeedContent { ...props } setIsEditing={ setIsEditing } />;
}
