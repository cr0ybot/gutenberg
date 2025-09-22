/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalVStack as VStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

export default function InheritControl( { inherit, onChange } ) {
	return (
		<VStack spacing={ 4 }>
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ __( 'Query type' ) }
				isBlock
				onChange={ ( value ) => {
					onChange( {
						inherit: value === 'default',
					} );
				} }
				help={
					inherit
						? __(
								'Display a list of terms based on the current template or term.'
						  )
						: __(
								'Display a list of terms based on specific criteria.'
						  )
				}
				value={ !! inherit ? 'default' : 'custom' }
			>
				<ToggleGroupControlOption
					value="default"
					label={ __( 'Default' ) }
				/>
				<ToggleGroupControlOption
					value="custom"
					label={ __( 'Custom' ) }
				/>
			</ToggleGroupControl>
		</VStack>
	);
}
