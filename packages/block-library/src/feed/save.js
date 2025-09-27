/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const useBlockPropsSave = useBlockProps.save;
const useInnerBlocksPropsSave = useInnerBlocksProps.save;

export default function Save( { attributes: { tagName: Tag = 'div' } } ) {
	const blockProps = useBlockPropsSave();
	const innerBlocksProps = useInnerBlocksPropsSave( blockProps );
	return <Tag { ...innerBlocksProps } />;
}
