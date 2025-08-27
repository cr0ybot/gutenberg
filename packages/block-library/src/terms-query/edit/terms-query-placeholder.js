/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import {
	useBlockProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker,
} from '@wordpress/block-editor';
import {
	Button,
	Flex,
	FlexBlock,
	Placeholder,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useScopedBlockVariations, useTaxonomies } from '../utils';
import { useBlockPatterns } from './pattern-selection';

function TaxonomyPicker( { attributes, setAttributes } ) {
	const { termQuery } = attributes;
	const { taxonomy } = termQuery;
	const [ selectedTaxonomy, setSelectedTaxonomy ] = useState( taxonomy );
	const taxonomies = useTaxonomies( attributes );

	const onSubmitTaxonomy = ( event ) => {
		event.preventDefault();

		if ( selectedTaxonomy ) {
			setAttributes( {
				termQuery: { ...termQuery, taxonomy: selectedTaxonomy },
			} );
		}
	};

	return (
		<form
			onSubmit={ onSubmitTaxonomy }
			className="wp-block-terms-query__placeholder-form"
		>
			{ ! taxonomies ? (
				<>
					<Spinner />
					<p>{ __( 'Loading taxonomies…' ) }</p>
				</>
			) : (
				<Flex
					direction="column"
					align="stretch"
					style={ { width: '100%' } }
				>
					<SelectControl
						label={ __( 'Select taxonomy' ) }
						value={ selectedTaxonomy }
						options={ [
							{
								value: '',
								label: __( 'Select a taxonomy' ),
							},
							...taxonomies?.map( ( { slug, name } ) => ( {
								value: slug,
								label: name,
							} ) ),
						] }
						onChange={ ( value ) => {
							setSelectedTaxonomy( value );
						} }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<FlexBlock>
						<Button
							__next40pxDefaultSize
							variant="primary"
							type="submit"
							style={ { marginLeft: 'auto' } }
						>
							{ __( 'Select taxonomy' ) }
						</Button>
					</FlexBlock>
				</Flex>
			) }
		</form>
	);
}

export default function TermsQueryPlaceholder( {
	attributes,
	context,
	clientId,
	name,
	setAttributes,
	openPatternSelectionModal,
} ) {
	const { termQuery } = attributes;
	const { termQuery: queryContext } = context;
	const taxonomy = queryContext?.taxonomy || termQuery?.taxonomy;
	const [ isStartingBlank, setIsStartingBlank ] = useState( false );
	const blockProps = useBlockProps();
	const { blockType, activeBlockVariation } = useSelect(
		( select ) => {
			const { getActiveBlockVariation, getBlockType } =
				select( blocksStore );
			return {
				blockType: getBlockType( name ),
				activeBlockVariation: getActiveBlockVariation(
					name,
					attributes
				),
			};
		},
		[ name, attributes ]
	);
	const hasPatterns = !! useBlockPatterns( clientId, attributes ).length;
	const icon =
		activeBlockVariation?.icon?.src ||
		activeBlockVariation?.icon ||
		blockType?.icon?.src;
	const label = activeBlockVariation?.title || blockType?.title;

	if ( isStartingBlank ) {
		return (
			<TermsQueryVariationPicker
				clientId={ clientId }
				attributes={ attributes }
				icon={ icon }
				label={ label }
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ icon }
				label={ label }
				instructions={ __(
					'Choose a pattern for the query loop or start blank.'
				) }
			>
				{ ! taxonomy ? (
					<TaxonomyPicker
						attributes={ attributes }
						setAttributes={ setAttributes }
					/>
				) : (
					<>
						{ !! hasPatterns && (
							<Button
								__next40pxDefaultSize
								variant="primary"
								onClick={ openPatternSelectionModal }
							>
								{ __( 'Choose' ) }
							</Button>
						) }
						<Button
							__next40pxDefaultSize
							variant="secondary"
							onClick={ () => {
								setIsStartingBlank( true );
							} }
						>
							{ __( 'Start blank' ) }
						</Button>
					</>
				) }
			</Placeholder>
		</div>
	);
}

function TermsQueryVariationPicker( { clientId, attributes, icon, label } ) {
	const scopeVariations = useScopedBlockVariations( attributes );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<__experimentalBlockVariationPicker
				icon={ icon }
				label={ label }
				variations={ scopeVariations }
				onSelect={ ( variation ) => {
					if ( variation.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(
								variation.innerBlocks
							),
							false
						);
					}
				} }
			/>
		</div>
	);
}
