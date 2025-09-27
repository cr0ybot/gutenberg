/**
 * WordPress dependencies
 */
import {
	BlockControls,
	InspectorControls,
	privateApis as blockEditorPrivateApis,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	ExternalLink,
	RangeControl,
	TextControl,
	ToggleControl,
	ToolbarGroup,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import { useToolsPanelDropdownMenuProps } from '../../utils/hooks';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

const TEMPLATE = [ [ 'core/feed-item-template' ], [ 'core/feed-no-results' ] ];
const DEFAULT_ITEMS = 5;
const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_MAX_ITEMS = 20;

export default function FeedContent( {
	attributes,
	setAttributes,
	clientId,
	setIsEditing,
} ) {
	const {
		itemsToShow,
		tagName: TagName = 'div',
		rel,
		openInNewTab,
	} = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const toolbarControls = [
		{
			icon: edit,
			title: __( 'Edit Feed URL' ),
			onClick: () => setIsEditing( true ),
		},
	];

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ toolbarControls } />
			</BlockControls>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings' ) }
					resetAll={ () => {
						setAttributes( {
							itemsToShow: DEFAULT_ITEMS,
							openInNewTab: false,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => itemsToShow !== DEFAULT_ITEMS }
						label={ __( 'Number of items' ) }
						onDeselect={ () =>
							setAttributes( { itemsToShow: DEFAULT_ITEMS } )
						}
						isShownByDefault
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Number of items' ) }
							value={ itemsToShow }
							onChange={ ( value ) =>
								setAttributes( { itemsToShow: value } )
							}
							min={ DEFAULT_MIN_ITEMS }
							max={ DEFAULT_MAX_ITEMS }
							required
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Open links in new tab' ) }
						hasValue={ () => !! openInNewTab }
						onDeselect={ () =>
							setAttributes( { openInNewTab: false } )
						}
						isShownByDefault
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open links in new tab' ) }
							checked={ openInNewTab }
							onChange={ ( value ) =>
								setAttributes( { openInNewTab: value } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<InspectorControls __experimentalGroup="advanced">
				<HTMLElementControl
					tagName={ TagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					clientId={ clientId }
					options={ [
						{ label: __( 'Default (<div>)' ), value: 'div' },
						{ label: '<main>', value: 'main' },
						{ label: '<section>', value: 'section' },
						{ label: '<aside>', value: 'aside' },
					] }
				/>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Link relation' ) }
					help={ createInterpolateElement(
						__(
							'The <a>Link Relation</a> attribute defines the relationship between a linked resource and the current document.'
						),
						{
							a: (
								<ExternalLink href="https://developer.mozilla.org/docs/Web/HTML/Attributes/rel" />
							),
						}
					) }
					value={ rel || '' }
					onChange={ ( value ) => setAttributes( { rel: value } ) }
				/>
			</InspectorControls>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
