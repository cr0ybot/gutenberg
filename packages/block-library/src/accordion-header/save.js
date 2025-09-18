/**
 * External dependencies
 */
import clsx from 'clsx';
/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	RichText,
} from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { level, title, iconPosition, textAlign, showIcon } = attributes;
	const TagName = 'h' + level;

	const blockProps = useBlockProps.save();
	const borderProps = getBorderClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );

	return (
		<TagName
			{ ...blockProps }
			className={ clsx(
				blockProps.className,
				colorProps.className,
				borderProps.className,
				'accordion-content__heading',
				{
					[ `has-custom-font-size` ]: blockProps?.style?.fontSize,
					[ `icon-position-left` ]: iconPosition === 'left',
					[ `has-text-align-${ textAlign }` ]: textAlign,
				}
			) }
			style={ {
				...borderProps.style,
				...colorProps.style,
				...shadowProps.style,
			} }
		>
			<button
				className={ clsx( 'accordion-content__toggle' ) }
				style={ {
					...spacingProps.style,
				} }
			>
				<RichText.Content tagName="span" value={ title } />
				{ showIcon && (
					<span className="accordion-content__toggle-icon">+</span>
				) }
			</button>
		</TagName>
	);
}
