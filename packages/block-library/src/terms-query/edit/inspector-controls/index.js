/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

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
		taxonomy,
		perPage,
		order,
		orderBy,
		hideEmpty,
		inherit = false,
	} = termQuery;
	const { termId } = context;
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const { templateSlug } = useSelect( ( select ) => {
		// @wordpress/block-library should not depend on @wordpress/editor.
		// Blocks can be loaded into a *non-post* block editor, so to avoid
		// declaring @wordpress/editor as a dependency, we must access its
		// store by string.
		// The solution here is to split WP specific blocks from generic blocks.
		// eslint-disable-next-line @wordpress/data-no-store-string-literals
		const { getEditedPostSlug } = select( 'core/editor' );
		return {
			templateSlug: getEditedPostSlug(),
		};
	}, [] );

	const isTaxonomyHierarchical = useSelect(
		( select ) => {
			const taxObject = select( coreStore ).getTaxonomy( taxonomy );
			return taxObject?.hierarchical;
		},
		[ taxonomy ]
	);

	const isTaxonomyMatchingTemplate =
		typeof templateSlug === 'string' && templateSlug.includes( taxonomy );

	/**
	 * Used to determine if the block is either nested in another Terms Query or
	 * in a Post/Term Archive context. In these contexts, inherit defaults to true.
	 */
	const isNested =
		( isTaxonomyHierarchical && !! termId ) || isTaxonomyMatchingTemplate;

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
								hierarchical: false,
								parent: false,
								perPage: 10,
								inherit: isNested,
							},
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => ! inherit }
						label={ __( 'Query type' ) }
						onDeselect={ () => setQuery( { inherit: isNested } ) }
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
