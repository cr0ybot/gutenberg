/**
 * WordPress dependencies
 */
import {
	Flex,
	BaseControl,
	__experimentalNumberControl as NumberControl,
	privateApis,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { OPERATOR_BETWEEN } from '../constants';
import type { DataFormControlProps } from '../types';
import { unlock } from '../lock-unlock';

const { ValidatedNumberControl } = unlock( privateApis );

function BetweenControls< Item >( {
	id,
	value,
	onChange,
	hideLabelFromVision,
}: {
	id: string;
	value: any;
	onChange: DataFormControlProps< Item >[ 'onChange' ];
	hideLabelFromVision?: boolean;
} ) {
	const [ min = '', max = '' ] = Array.isArray( value ) ? value : [];

	const onChangeMin = useCallback(
		( newValue: string | undefined ) =>
			onChange( {
				[ id ]: [ Number( newValue ), max ],
			} ),
		[ id, onChange, max ]
	);

	const onChangeMax = useCallback(
		( newValue: string | undefined ) =>
			onChange( {
				[ id ]: [ min, Number( newValue ) ],
			} ),
		[ id, onChange, min ]
	);

	return (
		<BaseControl
			__nextHasNoMarginBottom
			help={ __( 'The max. value must be greater than the min. value.' ) }
		>
			<Flex direction="row" gap={ 4 }>
				<NumberControl
					label={ __( 'Min.' ) }
					value={ min }
					max={ max ? Number( max ) - 1 : undefined }
					onChange={ onChangeMin }
					__next40pxDefaultSize
					hideLabelFromVision={ hideLabelFromVision }
				/>
				<NumberControl
					label={ __( 'Max.' ) }
					value={ max }
					min={ min ? Number( min ) + 1 : undefined }
					onChange={ onChangeMax }
					__next40pxDefaultSize
					hideLabelFromVision={ hideLabelFromVision }
				/>
			</Flex>
		</BaseControl>
	);
}

export default function Integer< Item >( {
	data,
	field,
	onChange,
	hideLabelFromVision,
	operator,
}: DataFormControlProps< Item > ) {
	const { id, label, description } = field;
	const value = field.getValue( { item: data } ) ?? '';
	const onChangeControl = useCallback(
		( newValue: string | undefined ) => {
			onChange( {
				// Do not convert an empty string or undefined to a number,
				// otherwise there's a mismatch between the UI control (empty)
				// and the data relied by onChange (0).
				[ id ]: [ '', undefined ].includes( newValue )
					? undefined
					: Number( newValue ),
			} );
		},
		[ id, onChange ]
	);

	if ( operator === OPERATOR_BETWEEN ) {
		return (
			<BetweenControls
				id={ id }
				value={ value }
				onChange={ onChange }
				hideLabelFromVision={ hideLabelFromVision }
			/>
		);
	}

	return (
		<ValidatedNumberControl
			required={ !! field.isValid?.required }
			customValidator={ ( newValue: any ) => {
				if ( field.isValid?.custom ) {
					return field.isValid.custom(
						{
							...data,
							[ id ]: [ undefined, '', null ].includes( newValue )
								? undefined
								: Number( newValue ),
						},
						field
					);
				}

				return null;
			} }
			label={ label }
			help={ description }
			value={ value }
			onChange={ onChangeControl }
			__next40pxDefaultSize
			hideLabelFromVision={ hideLabelFromVision }
		/>
	);
}
