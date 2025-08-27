/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TermQueryContent from './terms-query-content';
import TermQueryPlaceholder from './terms-query-placeholder';
import { PatternSelectionModal } from './pattern-selection';

const TermsQueryEdit = ( props ) => {
	const { attributes, clientId, context } = props;
	const { termQuery } = attributes;
	const [ isPatternSelectionModalOpen, setIsPatternSelectionModalOpen ] =
		useState( false );
	const { termQuery: queryContext } = context;
	// Force inherit if context is present.
	const inherit = !! ( queryContext ?? false ) || termQuery?.inherit;
	const taxonomy = inherit ? queryContext?.taxonomy : termQuery?.taxonomy;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);

	const Component =
		taxonomy && hasInnerBlocks ? TermQueryContent : TermQueryPlaceholder;
	return (
		<>
			<Component
				{ ...props }
				openPatternSelectionModal={ () =>
					setIsPatternSelectionModalOpen( true )
				}
			/>
			{ isPatternSelectionModalOpen && (
				<PatternSelectionModal
					clientId={ clientId }
					attributes={ attributes }
					setIsPatternSelectionModalOpen={
						setIsPatternSelectionModalOpen
					}
				/>
			) }
		</>
	);
};

export default TermsQueryEdit;
