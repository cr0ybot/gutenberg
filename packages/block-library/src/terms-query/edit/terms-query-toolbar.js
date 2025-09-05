/**
 * WordPress dependencies
 */
import {
	ToolbarGroup,
	ToolbarButton,
	Dropdown,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PatternSelection, { useBlockPatterns } from './pattern-selection';

export default function TermsQueryToolbar( {
	clientId,
	attributes,
	hasInnerBlocks,
} ) {
	const hasPatterns = useBlockPatterns( clientId, attributes ).length;
	if ( ! hasPatterns ) {
		return null;
	}

	const buttonLabel = hasInnerBlocks
		? __( 'Change design' )
		: __( 'Choose pattern' );

	return (
		<ToolbarGroup className="wp-block-template-part__block-control-group">
			<DropdownContentWrapper>
				<Dropdown
					contentClassName="block-editor-block-settings-menu__popover"
					focusOnMount="firstElement"
					expandOnMobile
					renderToggle={ ( { isOpen, onToggle } ) => (
						<ToolbarButton
							aria-haspopup="true"
							aria-expanded={ isOpen }
							onClick={ onToggle }
						>
							{ buttonLabel }
						</ToolbarButton>
					) }
					renderContent={ () => (
						<PatternSelection
							clientId={ clientId }
							attributes={ attributes }
							showSearch={ false }
							showTitlesAsTooltip
						/>
					) }
				/>
			</DropdownContentWrapper>
		</ToolbarGroup>
	);
}
