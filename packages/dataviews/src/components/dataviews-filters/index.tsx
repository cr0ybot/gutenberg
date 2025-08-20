/**
 * WordPress dependencies
 */
import {
	memo,
	useContext,
	useRef,
	useMemo,
	useCallback,
	useEffect,
} from '@wordpress/element';
import { __experimentalHStack as HStack, Button } from '@wordpress/components';
import { funnel } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Filter from './filter';
import { default as AddFilter, AddFilterMenu } from './add-filter';
import ResetFilters from './reset-filters';
import DataViewsContext from '../dataviews-context';
import { ALL_OPERATORS, SINGLE_SELECTION_OPERATORS } from '../../constants';
import type { NormalizedFilter, NormalizedField, View } from '../../types';

export function useFilters( fields: NormalizedField< any >[], view: View ) {
	return useMemo( () => {
		const filters: NormalizedFilter[] = [];
		fields.forEach( ( field ) => {
			if (
				field.filterBy === false ||
				( ! field.elements?.length && ! field.Edit )
			) {
				return;
			}

			const operators = field.filterBy.operators;
			const isPrimary = !! field.filterBy?.isPrimary;
			const isLocked =
				view.filters?.some(
					( f ) => f.field === field.id && !! f.isLocked
				) ?? false;
			filters.push( {
				field: field.id,
				name: field.label,
				elements: field.elements ?? [],
				singleSelection: operators.some( ( op ) =>
					SINGLE_SELECTION_OPERATORS.includes( op )
				),
				operators,
				isVisible:
					isLocked ||
					isPrimary ||
					!! view.filters?.some(
						( f ) =>
							f.field === field.id &&
							ALL_OPERATORS.includes( f.operator )
					),
				isPrimary,
				isLocked,
			} );
		} );

		// Sort filters by:
		// - locked filters go first
		// - primary filters go next
		// - then, sort by name
		filters.sort( ( a, b ) => {
			if ( a.isLocked && ! b.isLocked ) {
				return -1;
			}
			if ( ! a.isLocked && b.isLocked ) {
				return 1;
			}
			if ( a.isPrimary && ! b.isPrimary ) {
				return -1;
			}
			if ( ! a.isPrimary && b.isPrimary ) {
				return 1;
			}
			return a.name.localeCompare( b.name );
		} );
		return filters;
	}, [ fields, view ] );
}

export function FiltersToggle() {
	const {
		filters,
		view,
		onChangeView,
		setOpenedFilter,
		isShowingFilter,
		setIsShowingFilter,
	} = useContext( DataViewsContext );

	const buttonRef = useRef< HTMLButtonElement >( null );
	const onChangeViewWithFilterVisibility = useCallback(
		( _view: View ) => {
			onChangeView( _view );
			setIsShowingFilter( true );
		},
		[ onChangeView, setIsShowingFilter ]
	);
	const visibleFilters = filters.filter( ( filter ) => filter.isVisible );

	const hasVisibleFilters = !! visibleFilters.length;
	if ( filters.length === 0 ) {
		return null;
	}

	const addFilterButtonProps = {
		label: __( 'Add filter' ),
		'aria-expanded': false,
		isPressed: false,
	};
	const toggleFiltersButtonProps = {
		label: _x( 'Filter', 'verb' ),
		'aria-expanded': isShowingFilter,
		isPressed: isShowingFilter,
		onClick: () => {
			if ( ! isShowingFilter ) {
				setOpenedFilter( null );
			}
			setIsShowingFilter( ! isShowingFilter );
		},
	};
	const buttonComponent = (
		<Button
			ref={ buttonRef }
			className="dataviews-filters__visibility-toggle"
			size="compact"
			icon={ funnel }
			{ ...( hasVisibleFilters
				? toggleFiltersButtonProps
				: addFilterButtonProps ) }
		/>
	);
	return (
		<div className="dataviews-filters__container-visibility-toggle">
			{ ! hasVisibleFilters ? (
				<AddFilterMenu
					filters={ filters }
					view={ view }
					onChangeView={ onChangeViewWithFilterVisibility }
					setOpenedFilter={ setOpenedFilter }
					triggerProps={ { render: buttonComponent } }
				/>
			) : (
				<FilterVisibilityToggle
					buttonRef={ buttonRef }
					filtersCount={ view.filters?.length }
				>
					{ buttonComponent }
				</FilterVisibilityToggle>
			) }
		</div>
	);
}

function FilterVisibilityToggle( {
	buttonRef,
	filtersCount,
	children,
}: {
	buttonRef: React.RefObject< HTMLButtonElement >;
	filtersCount?: number;
	children: React.ReactNode;
} ) {
	// Focus the `add filter` button when unmounts.
	useEffect(
		() => () => {
			buttonRef.current?.focus();
		},
		[ buttonRef ]
	);
	return (
		<>
			{ children }
			{ !! filtersCount && (
				<span className="dataviews-filters-toggle__count">
					{ filtersCount }
				</span>
			) }
		</>
	);
}

function Filters( { className }: { className?: string } ) {
	const { fields, view, onChangeView, openedFilter, setOpenedFilter } =
		useContext( DataViewsContext );
	const addFilterRef = useRef< HTMLButtonElement >( null );
	const filters = useFilters( fields, view );
	const addFilter = (
		<AddFilter
			key="add-filter"
			filters={ filters }
			view={ view }
			onChangeView={ onChangeView }
			ref={ addFilterRef }
			setOpenedFilter={ setOpenedFilter }
		/>
	);
	const visibleFilters = filters.filter( ( filter ) => filter.isVisible );
	if ( visibleFilters.length === 0 ) {
		return null;
	}
	const filterComponents = [
		...visibleFilters.map( ( filter ) => {
			return (
				<Filter
					key={ filter.field }
					filter={ filter }
					view={ view }
					fields={ fields }
					onChangeView={ onChangeView }
					addFilterRef={ addFilterRef }
					openedFilter={ openedFilter }
				/>
			);
		} ),
		addFilter,
	];

	filterComponents.push(
		<ResetFilters
			key="reset-filters"
			filters={ filters }
			view={ view }
			onChangeView={ onChangeView }
		/>
	);

	return (
		<HStack
			justify="flex-start"
			style={ { width: 'fit-content' } }
			wrap
			className={ className }
		>
			{ filterComponents }
		</HStack>
	);
}

export default memo( Filters );
