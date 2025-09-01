/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Builds the arguments for a success notification dispatch.
 *
 * @param {Object} data Incoming data to build the arguments from.
 *
 * @return {Array} Arguments for dispatch. An empty array signals no
 *                 notification should be sent.
 */
export function getNotificationArgumentsForSaveSuccess( data ) {
	const { previousPost, post, postType } = data;
	// Autosaves are neither shown a notice nor redirected.
	if ( data.options?.isAutosave ) {
		return [];
	}

	const publishStatus = [ 'publish', 'private', 'future' ];
	const isPublished = publishStatus.includes( previousPost.status );
	const willPublish = publishStatus.includes( post.status );
	const willTrash =
		post.status === 'trash' && previousPost.status !== 'trash';

	let noticeMessage;
	let shouldShowLink = postType?.viewable ?? false;
	let isDraft;

	// Always should a notice, which will be spoken for accessibility.
	if ( willTrash ) {
		noticeMessage = postType.labels.item_trashed;
		shouldShowLink = false;
	} else if ( ! isPublished && ! willPublish ) {
		// If saving a non-published post, don't show notice.
		noticeMessage = __( 'Draft saved.' );
		isDraft = true;
	} else if ( isPublished && ! willPublish ) {
		// If undoing publish status, show specific notice.
		noticeMessage = postType.labels.item_reverted_to_draft;
		shouldShowLink = false;
	} else if ( ! isPublished && willPublish ) {
		// If publishing or scheduling a post, show the corresponding
		// publish message.
		noticeMessage = {
			publish: postType.labels.item_published,
			private: postType.labels.item_published_privately,
			future: postType.labels.item_scheduled,
		}[ post.status ];
	} else {
		// Generic fallback notice.
		noticeMessage = postType.labels.item_updated;
	}

	const actions = [];
	if ( shouldShowLink ) {
		actions.push( {
			label: isDraft ? __( 'View Preview' ) : postType.labels.view_item,
			url: post.link,
			openInNewTab: true,
		} );
	}
	return [
		noticeMessage,
		{
			id: 'editor-save',
			type: 'snackbar',
			actions,
		},
	];
}

/**
 * Builds the fail notification arguments for dispatch.
 *
 * @param {Object} data Incoming data to build the arguments with.
 *
 * @return {Array} Arguments for dispatch. An empty array signals no
 *                 notification should be sent.
 */
export function getNotificationArgumentsForSaveFail( data ) {
	const { post, edits, error } = data;
	if ( error && 'rest_autosave_no_changes' === error.code ) {
		// Autosave requested a new autosave, but there were no changes. This shouldn't
		// result in an error notice for the user.
		return [];
	}

	const publishStatus = [ 'publish', 'private', 'future' ];
	const isPublished = publishStatus.indexOf( post.status ) !== -1;

	if ( error.code === 'offline_error' ) {
		const messages = {
			publish: __( 'Publishing failed because you were offline.' ),
			private: __( 'Publishing failed because you were offline.' ),
			future: __( 'Scheduling failed because you were offline.' ),
			default: __( 'Updating failed because you were offline.' ),
		};

		const noticeMessage =
			! isPublished && edits.status in messages
				? messages[ edits.status ]
				: messages.default;

		return [ noticeMessage, { id: 'editor-save' } ];
	}

	const messages = {
		publish: __( 'Publishing failed.' ),
		private: __( 'Publishing failed.' ),
		future: __( 'Scheduling failed.' ),
		default: __( 'Updating failed.' ),
	};

	let noticeMessage =
		! isPublished && edits.status in messages
			? messages[ edits.status ]
			: messages.default;

	// Check if message string contains HTML. Notice text is currently only
	// supported as plaintext, and stripping the tags may muddle the meaning.
	if ( error.message && ! /<\/?[^>]*>/.test( error.message ) ) {
		noticeMessage = [ noticeMessage, error.message ].join( ' ' );
	}
	return [
		noticeMessage,
		{
			id: 'editor-save',
		},
	];
}

/**
 * Builds the trash fail notification arguments for dispatch.
 *
 * @param {Object} data
 *
 * @return {Array} Arguments for dispatch.
 */
export function getNotificationArgumentsForTrashFail( data ) {
	return [
		data.error.message && data.error.code !== 'unknown_error'
			? data.error.message
			: __( 'Trashing failed' ),
		{
			id: 'editor-trash-fail',
		},
	];
}
