/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import {
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { getQueryContextFromTemplate } from './utils';

const TEMPLATE = [
	[
		'core/group',
		{
			layout: {
				type: 'flex',
				orientation: 'horizontal',
			},
			style: {
				spacing: {
					blockGap: '0.5rem',
				},
			},
			metadata: {
				name: __( 'Term Name with Count' ),
			},
		},
		[
			[
				'core/paragraph',
				{
					metadata: {
						name: __( 'Term Name' ),
						bindings: {
							content: {
								source: 'core/term-data',
								args: {
									key: 'name',
								},
							},
						},
					},
				},
			],
			[
				'core/paragraph',
				{
					placeholder: __( '(count)' ),
					metadata: {
						name: __( 'Term Count' ),
						bindings: {
							content: {
								source: 'core/term-data',
								args: {
									key: 'count',
								},
							},
						},
					},
				},
			],
		],
	],
];

function TermTemplateInnerBlocks( { classList } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: clsx( 'wp-block-term', classList ) },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function TermTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: clsx( 'wp-block-term', classList ),
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

// Prevent re-rendering of the block preview when the terms data changes.
const MemoizedTermTemplateBlockPreview = memo( TermTemplateBlockPreview );

export default function TermTemplateEdit( {
	clientId,
	context: {
		termQuery: {
			taxonomy: initialTaxonomy,
			perPage,
			order,
			orderBy,
			include,
			exclude,
			hideEmpty = true,
			inherit: initialInherit,
			pages,
			parent = 0,
			// Gather extra query args to pass to the REST API call.
			// This way extenders of Term Query Loop can add their own query args,
			// and have accurate previews in the editor.
			// Noting though that these args should either be supported by the
			// REST API or be handled by custom REST filters like `rest_{$this->taxonomy}_query`.
			...restQueryArgs
		} = {},
		termId,
		termData,
		postId,
		templateSlug,
		previewTaxonomy,
	},
	__unstableLayoutClassNames,
} ) {
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();

	/**
	 * Default to inheriting the taxonomy if nested.
	 */
	const taxonomy =
		initialTaxonomy === 'category'
			? termData?.taxonomy ?? 'category'
			: initialTaxonomy;

	/**
	 * Default to inheriting the query if the block is nested and inherit is undefined.
	 */
	const inherit = initialInherit === undefined ? !! termId : initialInherit;

	const { terms, blocks } = useSelect(
		( select ) => {
			const { getEntityRecords } = select( coreStore );
			const { getBlocks } = select( blockEditorStore );

			const queryArgs = {
				parent: parent || 0,
				order,
				orderby: orderBy,
				hide_empty: hideEmpty,
				// To preview the data the closest to the frontend, we fetch the largest number of terms
				// and limit them during rendering. This is because WP_Term_Query fetches data in hierarchical manner,
				// while in editor we build the hierarchy manually. It also allows us to avoid re-fetching data when max terms changes.
				per_page: 100,
			};

			// If `inherit` is truthy, adjust the query conditionally to create a better preview.
			let currentTaxonomy = taxonomy;
			if ( inherit ) {
				if ( termId ) {
					// If termId is already provided in context, use that as parent.
					queryArgs.parent = termId;
					// Also inherit the taxonomy from the current term.
					currentTaxonomy = termData?.taxonomy || taxonomy;
				} else {
					const { templateType, templateQuery } =
						getQueryContextFromTemplate( templateSlug );

					if ( postId ) {
						// If we're on a post, get only the terms for the current post.
						queryArgs.post = postId;
						// We already skipped the termId check so we remove the parent arg.
						delete queryArgs.parent;
					} else if ( templateType === 'taxonomy' && templateQuery ) {
						// Inherit taxonomy from taxonomy archive template slug.
						currentTaxonomy = templateQuery;

						// If we're on a specific term archive template, fetch the term ID to use as the parent.
						const templateTaxonomy = getEntityRecords(
							'taxonomy',
							currentTaxonomy,
							{
								context: 'view',
								per_page: 1,
								_fields: [ 'id' ],
								slug: templateQuery,
							}
						);

						if ( templateTaxonomy ) {
							queryArgs.parent = templateTaxonomy[ 0 ]?.id ?? 0;
						}
					}
				}
			}

			// When we preview Term Query Loop blocks we should prefer the current
			// block's taxonomy, which is passed through block context.
			const usedTaxonomy = previewTaxonomy || currentTaxonomy;

			const isHierarchical =
				select( coreStore ).getTaxonomy( usedTaxonomy )?.hierarchical;

			// If parent is defined and the taxonomy is not hierarchical, no need
			// to fetch since there are no child terms.
			if ( queryArgs.parent > 0 && ! isHierarchical ) {
				return { terms: [], blocks: getBlocks( clientId ) };
			}

			return {
				terms: getEntityRecords( 'taxonomy', usedTaxonomy, {
					...queryArgs,
					...restQueryArgs,
				} ),
				blocks: getBlocks( clientId ),
			};
		},
		[
			taxonomy,
			order,
			orderBy,
			hideEmpty,
			parent,
			inherit,
			restQueryArgs,
			clientId,
			termId,
			termData,
			postId,
			templateSlug,
			previewTaxonomy,
		]
	);

	const blockProps = useBlockProps( {
		className: __unstableLayoutClassNames,
	} );

	// Limit terms to the perPage value and filter out excludes.
	const filteredTerms = useMemo( () => {
		if ( null === terms ) {
			return null;
		}
		return terms.slice( 0, perPage ).filter( ( term ) => {
			if ( exclude && exclude.includes( term.id ) ) {
				return false;
			}
			return true;
		} );
	}, [ terms, exclude, perPage ] );

	const blockContexts = useMemo(
		() =>
			filteredTerms
				? filteredTerms?.map( ( term ) => ( {
						taxonomy,
						termId: term.id,
						classList: `term-${ term.id }`,
						termData: term,
				  } ) )
				: [],
		[ filteredTerms, taxonomy ]
	);

	if ( ! filteredTerms ) {
		return (
			<div { ...blockProps }>
				<p className="wp-block-term-template__loading">
					<Spinner />
					{ inherit
						? sprintf(
								/* translators: %s: term name */
								__( 'Loading %s child terms…' ),
								termData?.name ?? taxonomy
						  )
						: sprintf(
								/* translators: %s: taxonomy slug */
								__( 'Loading %s terms…' ),
								taxonomy
						  ) }
				</p>
			</div>
		);
	}

	if ( ! filteredTerms.length ) {
		return <p { ...blockProps }> { __( 'No results found.' ) }</p>;
	}

	return (
		<>
			<ul { ...blockProps }>
				{ blockContexts &&
					blockContexts.map( ( blockContext ) => (
						<BlockContextProvider
							key={ blockContext.termId }
							value={ blockContext }
						>
							{ blockContext.termId ===
							( activeBlockContextId ||
								blockContexts[ 0 ]?.termId ) ? (
								<TermTemplateInnerBlocks
									classList={ blockContext.classList }
								/>
							) : null }
							<MemoizedTermTemplateBlockPreview
								blocks={ blocks }
								blockContextId={ blockContext.termId }
								classList={ blockContext.classList }
								setActiveBlockContextId={
									setActiveBlockContextId
								}
								isHidden={
									blockContext.termId ===
									( activeBlockContextId ||
										blockContexts[ 0 ]?.termId )
								}
							/>
						</BlockContextProvider>
					) ) }
			</ul>
		</>
	);
}
