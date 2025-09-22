/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../../../utils/hooks';
import TaxonomyControl from './taxonomy-control';
import OrderControls from './order-controls';
import InheritControl from './inherit-control';
import EmptyTermsControl from './empty-terms-control';
import MaxTermsControl from './max-terms-control';
import AdvancedControls from './advanced-controls';

export default function TermsQueryInspectorControls( props ) {
	const { attributes, setQuery, setAttributes, TagName, clientId, context } =
		props;
	const { termQuery } = attributes;
	const {
		taxonomy: initialTaxonomy,
		perPage,
		order,
		orderBy,
		hideEmpty,
		inherit: initialInherit,
	} = termQuery;
	const { termId, termData } = context;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	/**
	 * Inherit taxonomy if not defined.
	 */
	const taxonomy = initialTaxonomy || ( termData?.taxonomy ?? 'category' );

	/**
	 * Default to inheriting the query if the block is nested and inherit is undefined.
	 */
	const inherit = initialInherit === undefined ? !! termId : initialInherit;

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Terms Query Settings' ) }
					resetAll={ () => {
						setAttributes( {
							termQuery: {
								taxonomy: 'category',
								order: 'asc',
								orderBy: 'name',
								hideEmpty: true,
								parent: 0,
								perPage: 10,
								inherit,
							},
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => initialInherit !== inherit }
						label={ __( 'Query type' ) }
						onDeselect={ () => setQuery( { inherit } ) }
						isShownByDefault
					>
						<InheritControl
							inherit={ inherit }
							onChange={ setQuery }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => taxonomy !== 'category' }
						label={ __( 'Taxonomy' ) }
						onDeselect={ () => {
							setQuery( { taxonomy: 'category' } );
						} }
						isShownByDefault
					>
						<TaxonomyControl
							taxonomy={ taxonomy }
							onChange={ setQuery }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => orderBy !== 'name' || order !== 'asc' }
						label={ __( 'Order by' ) }
						onDeselect={ () =>
							setQuery( { orderBy: 'name', order: 'asc' } )
						}
						isShownByDefault
					>
						<OrderControls
							{ ...{ order, orderBy } }
							onChange={ setQuery }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => hideEmpty !== true }
						label={ __( 'Show empty terms' ) }
						onDeselect={ () => setQuery( { hideEmpty: true } ) }
						isShownByDefault
					>
						<EmptyTermsControl
							hideEmpty={ hideEmpty }
							onChange={ setQuery }
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={ () => perPage !== 10 }
						label={ __( 'Max terms' ) }
						onDeselect={ () => setQuery( { perPage: 10 } ) }
						isShownByDefault
					>
						<MaxTermsControl
							perPage={ perPage }
							onChange={ setQuery }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<AdvancedControls
				TagName={ TagName }
				setAttributes={ setAttributes }
				clientId={ clientId }
			/>
		</>
	);
}
