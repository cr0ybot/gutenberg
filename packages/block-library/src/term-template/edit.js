/**
 * WordPress dependencies
 */
import { memo, useMemo, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	__experimentalBlockVariationPicker as BlockVariationPicker,
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToolbarGroup,
	PanelBody,
	SelectControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

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

function TermTemplateInnerBlocks( { classList, blockLayout = 'list' } ) {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: `wp-block-term ${ classList }` },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);

	// Use different HTML element based on layout
	if ( blockLayout === 'grid' ) {
		return <div { ...innerBlocksProps } />;
	}

	return <li { ...innerBlocksProps } />;
}

function TermTemplateBlockPreview( {
	blocks,
	blockContextId,
	classList,
	isHidden,
	setActiveBlockContextId,
	blockLayout = 'list',
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

	// Use different HTML element based on layout
	if ( blockLayout === 'grid' ) {
		return (
			<div
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
 * @param {Object}   termNode    Term node with term object and children.
 * @param {Function} renderTerm  Function to render individual terms.
 * @param {string}   blockLayout Layout type ('list' or 'grid').
 * @return {JSX.Element} Rendered term node with children.
 */
function renderTermNode( termNode, renderTerm, blockLayout = 'list' ) {
	const ContainerElement = blockLayout === 'grid' ? 'div' : 'ul';

	return (
		<>
			{ renderTerm( termNode.term ) }
			{ termNode.children.length > 0 && (
				<ContainerElement>
					{ termNode.children.map( ( child ) =>
						renderTermNode( child, renderTerm, blockLayout )
					) }
				</ContainerElement>
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
	attributes,
	setAttributes,
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
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

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

	const { blocks, variations, defaultVariation } = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			const { getBlockVariations, getDefaultBlockVariation } =
				select( blocksStore );

			return {
				blocks: getBlocks( clientId ),
				variations: getBlockVariations( 'core/term-template', 'block' ),
				defaultVariation: getDefaultBlockVariation(
					'core/term-template',
					'block'
				),
			};
		},
		[ clientId ]
	);

	const blockLayout = attributes?.blockLayout || 'list';
	const columnCount = attributes?.columnCount || 3;

	// Switch to list if hierarchical is true and grid is selected.
	useMemo( () => {
		if ( hierarchical && blockLayout === 'grid' ) {
			setAttributes( { blockLayout: 'list' } );
		}
	}, [ hierarchical, blockLayout, setAttributes ] );

	const blockProps = useBlockProps( {
		className: blockLayout === 'grid' ? `columns-${ columnCount }` : '',
	} );

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

	// Show variation picker if no blocks exist.
	if ( ! blocks?.length ) {
		return (
			<div { ...blockProps }>
				<BlockVariationPicker
					icon="layout"
					label={ __( 'Term Template' ) }
					variations={ variations }
					instructions={ __(
						'Choose a layout for displaying terms:'
					) }
					onSelect={ ( nextVariation = defaultVariation ) => {
						if ( nextVariation.attributes ) {
							setAttributes( nextVariation.attributes );
						}
						if ( nextVariation.innerBlocks ) {
							replaceInnerBlocks(
								clientId,
								createBlocksFromInnerBlocksTemplate(
									nextVariation.innerBlocks
								),
								true
							);
						}
					} }
					allowSkip
				/>
			</div>
		);
	}

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
						blockLayout={ attributes?.blockLayout || 'list' }
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
					blockLayout={ attributes?.blockLayout || 'list' }
				/>
			</BlockContextProvider>
		);
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup />
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Style' ) }>
					<ToggleGroupControl
						label={ __( 'Layout' ) }
						value={ attributes?.blockLayout || 'list' }
						help={
							hierarchical
								? __(
										'Grid layout is not available if the "Show hierarchy" option is enabled.'
								  )
								: ''
						}
						onChange={ ( value ) =>
							setAttributes( { blockLayout: value } )
						}
						isBlock
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption
							value="list"
							label={ __( 'List' ) }
						/>
						<ToggleGroupControlOption
							value="grid"
							label={ __( 'Grid' ) }
							disabled={ hierarchical }
						/>
					</ToggleGroupControl>
					<div
						style={ {
							height:
								attributes?.blockLayout === 'grid'
									? 'auto'
									: '0',
							overflow: 'hidden',
							opacity: attributes?.blockLayout === 'grid' ? 1 : 0,
							transition: 'height 0.2s ease, opacity 0.2s ease',
						} }
					>
						<SelectControl
							label={ __( 'Number of Columns' ) }
							value={ attributes?.columnCount || 3 }
							options={ [
								{
									label: __( '2 Columns' ),
									value: 2,
								},
								{
									label: __( '3 Columns' ),
									value: 3,
								},
								{
									label: __( '4 Columns' ),
									value: 4,
								},
							] }
							onChange={ ( value ) =>
								setAttributes( {
									columnCount: parseInt( value ),
								} )
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</div>
				</PanelBody>
			</InspectorControls>

			<ul { ...blockProps }>
				{ hierarchical
					? // Hierarchical rendering
					  buildTermsTree( filteredTerms ).map( ( termNode ) =>
							renderTermNode(
								termNode,
								renderTerm,
								attributes?.blockLayout || 'list'
							)
					  )
					: // Flat rendering
					  blockContexts &&
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
										blockLayout={
											attributes?.blockLayout || 'list'
										}
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
									blockLayout={
										attributes?.blockLayout || 'list'
									}
								/>
							</BlockContextProvider>
					  ) ) }
			</ul>
		</>
	);
}
