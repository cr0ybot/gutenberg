/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useInstanceId } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import {
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
	useInnerBlocksProps,
	privateApis as blockEditorPrivateApis,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { unlock } from '../lock-unlock';
import TermsQueryInspectorControls from './inspector-controls';

const { HTMLElementControl } = unlock( blockEditorPrivateApis );

export default function TermsQueryContent( {
	attributes,
	setAttributes,
	clientId,
	name,
} ) {
	const {
		termQueryId,
		termQuery = {},
		tagName: TagName = 'div',
	} = attributes;

	const { __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( blockEditorStore );
	const instanceId = useInstanceId( TermsQueryContent );
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps );

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
			<InspectorControls>
				<TermsQueryInspectorControls
					name={ name }
					attributes={ attributes }
					setQuery={ setQuery }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</InspectorControls>
			<InspectorControls group="advanced">
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
