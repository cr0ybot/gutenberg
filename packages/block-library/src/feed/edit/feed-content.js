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
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { edit } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

const TEMPLATE = [ [ 'core/feed-item-template' ], [ 'core/feed-no-results' ] ];
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
		itemLinkRel,
		itemLinkTarget,
	} = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

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
				<PanelBody title={ __( 'Feed Loop Settings' ) }>
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
				</PanelBody>
				<PanelBody title={ __( 'Link Settings' ) }>
					<p className="description">
						These link settings apply to any feed-specific link
						elements within the Feed Loop.
					</p>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Open in new tab' ) }
						checked={ itemLinkTarget === '_blank' }
						onChange={ ( nextIsNewTab ) => {
							setAttributes( {
								itemLinkTarget: nextIsNewTab
									? '_blank'
									: '_self',
							} );
						} }
					/>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Link rel' ) }
						value={ itemLinkRel }
						onChange={ ( nextRel ) => {
							setAttributes( { itemLinkRel: nextRel } );
						} }
					/>
				</PanelBody>
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
			</InspectorControls>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
