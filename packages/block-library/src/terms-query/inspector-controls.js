/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

export default function TermsQueryInspectorControls( {
	attributes,
	setQuery,
	setAttributes,
} ) {
	const { query } = attributes;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const { taxonomies } = useSelect( ( select ) => {
		const { getEntityRecords } = select( coreStore );
		const allTaxonomies = getEntityRecords( 'root', 'taxonomy' );
		return {
			taxonomies:
				allTaxonomies?.filter( ( t ) => t.visibility.public ) || [],
		};
	}, [] );

	const taxonomyOptions = taxonomies.map( ( taxonomy ) => ( {
		label: taxonomy.name,
		value: taxonomy.slug,
	} ) );

	return (
		<ToolsPanel
			label={ __( 'Terms Query Settings' ) }
			resetAll={ () => {
				setAttributes( {
					query: {
						taxonomy: 'category',
						order: 'asc',
						orderBy: 'name',
						hideEmpty: true,
						hierarchical: false,
						showOnlyTopLevel: false,
					},
				} );
			} }
			dropdownMenuProps={ dropdownMenuProps }
		>
			<ToolsPanelItem
				hasValue={ () => query.taxonomy !== 'category' }
				label={ __( 'Taxonomy' ) }
				onDeselect={ () => setQuery( { taxonomy: 'category' } ) }
				isShownByDefault
			>
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Taxonomy' ) }
					options={ taxonomyOptions }
					value={ query.taxonomy }
					onChange={ ( selectedTaxonomy ) =>
						setQuery( { taxonomy: selectedTaxonomy } )
					}
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.order !== 'asc' }
				label={ __( 'Order' ) }
				onDeselect={ () => setQuery( { order: 'asc' } ) }
				isShownByDefault
			>
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Order' ) }
					options={ [
						{ label: __( 'Ascending' ), value: 'asc' },
						{ label: __( 'Descending' ), value: 'desc' },
					] }
					value={ query.order }
					onChange={ ( order ) => setQuery( { order } ) }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.orderBy !== 'name' }
				label={ __( 'Order by' ) }
				onDeselect={ () => setQuery( { orderBy: 'name' } ) }
				isShownByDefault
			>
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'Order by' ) }
					options={ [
						{ label: __( 'Name' ), value: 'name' },
						{ label: __( 'Slug' ), value: 'slug' },
						{ label: __( 'Count' ), value: 'count' },
					] }
					value={ query.orderBy }
					onChange={ ( orderBy ) => setQuery( { orderBy } ) }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.showOnlyTopLevel !== false }
				label={ __( 'Show only top level terms' ) }
				onDeselect={ () => setQuery( { showOnlyTopLevel: false } ) }
				isShownByDefault
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show only top level terms' ) }
					checked={ query.showOnlyTopLevel }
					onChange={ ( showOnlyTopLevel ) => {
						setQuery( { showOnlyTopLevel } );
						if ( showOnlyTopLevel && query.hierarchical ) {
							setQuery( { hierarchical: false } );
						}
					} }
					disabled={ !! query.hierarchical }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.hideEmpty !== true }
				label={ __( 'Show empty terms' ) }
				onDeselect={ () => setQuery( { hideEmpty: true } ) }
				isShownByDefault
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show empty terms' ) }
					checked={ ! query.hideEmpty }
					onChange={ ( showEmpty ) =>
						setQuery( { hideEmpty: ! showEmpty } )
					}
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => query.hierarchical !== false }
				label={ __( 'Show hierarchy' ) }
				onDeselect={ () => setQuery( { hierarchical: false } ) }
				isShownByDefault
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Show hierarchy' ) }
					checked={ query.hierarchical }
					onChange={ ( hierarchical ) => {
						setQuery( { hierarchical } );
						if ( hierarchical && query.showOnlyTopLevel ) {
							setQuery( { showOnlyTopLevel: false } );
						}
					} }
					disabled={ !! query.showOnlyTopLevel }
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}
