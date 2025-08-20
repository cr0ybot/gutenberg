/**
 * WordPress dependencies
 */
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';

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
		{ className: `wp-block-term ${ classList }` },
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
			className: `wp-block-term ${ classList }`,
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

/**
 * Builds a hierarchical tree structure from flat terms array.
 *
 * @param {Array} terms Array of term objects.
 * @return {Array} Tree structure with parent/child relationships.
 */
function buildTermsTree( terms ) {
	const termsById = {};
	const rootTerms = [];

	terms.forEach( ( term ) => {
		termsById[ term.id ] = {
			term,
			children: [],
		};
	} );

	terms.forEach( ( term ) => {
		if ( term.parent && termsById[ term.parent ] ) {
			termsById[ term.parent ].children.push( termsById[ term.id ] );
		} else {
			rootTerms.push( termsById[ term.id ] );
		}
	} );

	return rootTerms;
}

/**
 * Renders a single term node and its children recursively.
 *
 * @param {Object}   termNode   Term node with term object and children.
 * @param {Function} renderTerm Function to render individual terms.
 * @return {JSX.Element} Rendered term node with children.
 */
function renderTermNode( termNode, renderTerm ) {
	return (
		<>
			{ renderTerm( termNode.term ) }
			{ termNode.children.length > 0 && (
				<ul>
					{ termNode.children.map( ( child ) =>
						renderTermNode( child, renderTerm )
					) }
				</ul>
			) }
		</>
	);
}

/**
 * Checks if a term is the currently active term.
 *
 * @param {number} termId               The term ID to check.
 * @param {number} activeBlockContextId The currently active block context ID.
 * @param {Array}  blockContexts        Array of block contexts.
 * @return {boolean} True if the term is active, false otherwise.
 */
function isActiveTerm( termId, activeBlockContextId, blockContexts ) {
	return termId === ( activeBlockContextId || blockContexts[ 0 ]?.termId );
}

export default function TermTemplateEdit( {
	clientId,
	context: {
		termQuery: {
			taxonomy,
			order,
			orderBy,
			hideEmpty,
			hierarchical,
			parent,
			perPage = 100,
		} = {},
	},
} ) {
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();

	const queryArgs = {
		order,
		orderby: orderBy,
		hide_empty: hideEmpty,
		per_page: perPage,
	};

	const { records: terms, isResolving } = useEntityRecords(
		'taxonomy',
		taxonomy,
		queryArgs
	);

	// Filter to show only top-level terms if "Show only top-level terms" is enabled.
	const filteredTerms = useMemo( () => {
		if ( ! terms || parent !== 0 ) {
			return terms;
		}
		return terms.filter( ( term ) => ! term.parent );
	}, [ terms, parent ] );

	const { blocks } = useSelect(
		( select ) => ( {
			blocks: select( blockEditorStore ).getBlocks( clientId ),
		} ),
		[ clientId ]
	);

	const blockContexts = useMemo(
		() =>
			filteredTerms?.map( ( term ) => ( {
				taxonomy,
				termId: term.id,
				classList: `term-${ term.id }`,
				termData: term,
			} ) ),
		[ filteredTerms, taxonomy ]
	);

	const blockProps = useBlockProps();

	if ( isResolving ) {
		return (
			<ul { ...blockProps }>
				<li className="wp-block-term term-loading">
					<div className="term-loading-placeholder" />
				</li>
				<li className="wp-block-term term-loading">
					<div className="term-loading-placeholder" />
				</li>
				<li className="wp-block-term term-loading">
					<div className="term-loading-placeholder" />
				</li>
			</ul>
		);
	}

	if ( ! filteredTerms?.length ) {
		return <p { ...blockProps }> { __( 'No terms found.' ) }</p>;
	}

	const renderTerm = ( term ) => {
		const blockContext = {
			taxonomy,
			termId: term.id,
			classList: `term-${ term.id }`,
			termData: term,
		};

		return (
			<BlockContextProvider key={ term.id } value={ blockContext }>
				{ isActiveTerm(
					term.id,
					activeBlockContextId,
					blockContexts
				) ? (
					<TermTemplateInnerBlocks
						classList={ blockContext.classList }
					/>
				) : null }
				<MemoizedTermTemplateBlockPreview
					blocks={ blocks }
					blockContextId={ term.id }
					classList={ blockContext.classList }
					setActiveBlockContextId={ setActiveBlockContextId }
					isHidden={ isActiveTerm(
						term.id,
						activeBlockContextId,
						blockContexts
					) }
				/>
			</BlockContextProvider>
		);
	};

	const renderTerms = () => {
		if ( hierarchical ) {
			const termsTree = buildTermsTree( filteredTerms );
			return termsTree.map( ( termNode ) =>
				renderTermNode( termNode, renderTerm )
			);
		}

		return blockContexts.map( ( blockContext ) => (
			<BlockContextProvider
				key={ blockContext.termId }
				value={ blockContext }
			>
				{ isActiveTerm(
					blockContext.termId,
					activeBlockContextId,
					blockContexts
				) ? (
					<TermTemplateInnerBlocks
						classList={ blockContext.classList }
					/>
				) : null }
				<MemoizedTermTemplateBlockPreview
					blocks={ blocks }
					blockContextId={ blockContext.termId }
					classList={ blockContext.classList }
					setActiveBlockContextId={ setActiveBlockContextId }
					isHidden={ isActiveTerm(
						blockContext.termId,
						activeBlockContextId,
						blockContexts
					) }
				/>
			</BlockContextProvider>
		) );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup />
			</BlockControls>

			<ul { ...blockProps }>{ renderTerms() }</ul>
		</>
	);
}
