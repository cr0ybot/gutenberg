/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import FeedPlaceholder from './feed-placeholder';
import FeedContent from './feed-content';

export default function Edit( props ) {
	const { attributes } = props;
	const { feedURL } = attributes;

	const [ isEditing, setIsEditing ] = useState( ! attributes.feedURL );

	const onSubmitFeedUrl = () => {
		if ( feedURL ) {
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
