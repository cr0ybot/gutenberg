/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import {
	BlockContextProvider,
	useBlockProps,
	store as blockEditorStore,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import TermsQueryInspectorControls from './inspector-controls';

const TEMPLATE = [ [ 'core/term-template' ] ];

export default function TermsQueryEdit( props ) {
	const { attributes, setAttributes, context } = props;
	const {
		termQueryId,
		termQuery = {},
		tagName: TagName = 'div',
	} = attributes;
	const {
		inherit,
		taxonomy: initialTaxonomy,
		parent: initialParent,
	} = termQuery;
	const {
		termQuery: queryContext = {},
		taxonomy: contextTaxonomy,
		termId: termIdContext,
	} = context;
	const { taxonomy: queryContextTaxonomy } = queryContext;

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const instanceId = useInstanceId( TermsQueryEdit );
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	// Maybe inherit taxonomy from parent query.
	const taxonomyInherited = inherit && !! queryContext;
	const taxonomy = taxonomyInherited
		? contextTaxonomy ?? queryContextTaxonomy ?? initialTaxonomy
		: initialTaxonomy;

	// Maybe inherit parent from parent query.
	const parentInherited = inherit && !! termIdContext;
	const parent = parentInherited ? termIdContext : initialParent || 0;

	/**
	 * The termQuery context is not declared in the block.json file's
	 * `providesContext` property so that we can control the value without
	 * being beholden to the block's attribute value.
	 */
	const termQueryContextObject = {
		termQuery: { ...termQuery, parent, taxonomy },
	};

	const setQuery = ( newQuery ) => {
		setAttributes( {
			termQuery: {
				...termQuery,
				...newQuery,
			},
		} );
	};

	useEffect( () => {
		if ( ! termQueryId ) {
			__unstableMarkNextChangeAsNotPersistent();
			setAttributes( { termQueryId: instanceId } );
		}
	}, [
		termQueryId,
		instanceId,
		setAttributes,
		__unstableMarkNextChangeAsNotPersistent,
	] );

	return (
		<>
			<TermsQueryInspectorControls { ...props } setQuery={ setQuery } />
			<BlockContextProvider value={ termQueryContextObject }>
				<TagName { ...innerBlocksProps } />
			</BlockContextProvider>
		</>
	);
}
