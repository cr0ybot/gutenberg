/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

const usePublicTaxonomies = () => {
	const taxonomies = useSelect(
		( select ) => select( coreStore ).getTaxonomies( { per_page: -1 } ),
		[]
	);
	return useMemo( () => {
		return (
			taxonomies?.filter(
				( { visibility } ) => visibility?.publicly_queryable
			) || []
		);
	}, [ taxonomies ] );
};

export default function TaxonomyControl( { taxonomy, onChange } ) {
	const taxonomies = usePublicTaxonomies();

	const taxonomyOptions = taxonomies.map( ( tax ) => ( {
		label: tax.name,
		value: tax.slug,
	} ) );

	return (
		<SelectControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Taxonomy' ) }
			options={ taxonomyOptions }
			value={ taxonomy }
			onChange={ ( selectedTaxonomy ) => {
				onChange( { taxonomy: selectedTaxonomy } );
			} }
		/>
	);
}
