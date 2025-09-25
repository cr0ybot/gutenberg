/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

export default function MaxTermsControl( { perPage, onChange } ) {
	return (
		<RangeControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Max terms' ) }
			value={ perPage }
			min={ 0 }
			max={ 100 }
			onChange={ ( newPerPage ) => {
				// Show all terms (-1) when 0 is selected.
				onChange( {
					perPage: newPerPage === 0 ? -1 : newPerPage,
				} );
			} }
			help={ __(
				'Limit the number of terms you want to show. To show all terms, use 0 (zero).'
			) }
		/>
	);
}
