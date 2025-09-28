/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	BlockContextProvider,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { memo, useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const TEMPLATE = [ [ 'core/feed-item-title' ], [ 'core/feed-item-content' ] ];

function FeedItemTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'wp-block-feed-item', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function FeedItemTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'wp-block-feed-item', classList ),
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedFeedItemTemplateBlockPreview = memo(
	FeedItemTemplateBlockPreview
);

export default function FeedItemTemplateEdit( {
	clientId,
	context: { feedUrl, itemsToShow },
	__unstableLayoutClassNames,
} ) {
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const [ feed, setFeed ] = useState( null );
	const [ isLoading, setIsLoading ] = useState( true );

	const { blocks } = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return {
				blocks: getBlocks( clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		// To do: Fetch feed JSON.
		if ( ! feedUrl ) {
			setFeed( null );
			setIsLoading( false );
			return;
		}

		setIsLoading( true );
		// Delay to simulate loading.
		const timeoutId = setTimeout( () => {
			setFeed( { items: [] } );
			setIsLoading( false );
		}, 5000 );

		return () => clearTimeout( timeoutId );
	}, [ feedUrl ] );

	const blockContexts = useMemo( () => {
		const items = feed?.items?.slice( 0, itemsToShow );
		if ( ! items?.length ) {
			return [];
		}

		return items.map( ( item, index ) => ( {
			feedItemId: item.id || index,
			feedItem: item,
			classList: `feed-item-${ item.id || index }`,
		} ) );
	}, [ feed, itemsToShow ] );

	const blockProps = useBlockProps( {
		className: __unstableLayoutClassNames,
	} );

	if ( ! feed ) {
		return (
			<div { ...blockProps }>
				<p className="wp-block-feed-item-template__loading">
					<Spinner />
					{ __( 'Loading feed:' ) } <code>{ feedUrl }</code>
				</p>
			</div>
		);
	}

	if ( ! isLoading && ! feed?.items?.length ) {
		return <p { ...blockProps }>{ __( 'No items found.' ) }</p>;
	}

	return (
		<ul { ...blockProps }>
			{ blockContexts &&
				blockContexts.map( ( blockContext ) => (
					<BlockContextProvider
						key={ blockContext.feedItemId }
						value={ blockContext }
					>
						{ blockContext.feedItemId ===
						( activeBlockContextId ||
							blockContexts[ 0 ]?.feedItemId ) ? (
							<FeedItemTemplateInnerBlocks
								classList={ blockContext.classList }
							/>
						) : null }
						<MemoizedFeedItemTemplateBlockPreview
							blocks={ blocks }
							blockContextId={ blockContext.feedItemId }
							classList={ blockContext.classList }
							setActiveBlockContextId={ setActiveBlockContextId }
							isHidden={
								blockContext.feedItemId ===
								( activeBlockContextId ||
									blockContexts[ 0 ]?.feedItemId )
							}
						/>
					</BlockContextProvider>
				) ) }
		</ul>
	);
}
