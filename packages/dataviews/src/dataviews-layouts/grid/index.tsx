/**
 * External dependencies
 */
import clsx from 'clsx';
import type { ComponentProps, ReactElement } from 'react';

/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	Spinner,
	Flex,
	FlexItem,
	Tooltip,
	privateApis as componentsPrivateApis,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { isAppleOS } from '@wordpress/keycodes';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';
import ItemActions from '../../components/dataviews-item-actions';
import DataViewsSelectionCheckbox from '../../components/dataviews-selection-checkbox';
import DataViewsContext from '../../components/dataviews-context';
import {
	useHasAPossibleBulkAction,
	useSomeItemHasAPossibleBulkAction,
} from '../../components/dataviews-bulk-actions';
import type {
	Action,
	NormalizedField,
	ViewGrid as ViewGridType,
	ViewGridProps,
} from '../../types';
import type { SetSelection } from '../../private-types';
import { ItemClickWrapper } from '../utils/item-click-wrapper';
const { Badge } = unlock( componentsPrivateApis );

interface GridItemProps< Item > {
	view: ViewGridType;
	selection: string[];
	onChangeSelection: SetSelection;
	getItemId: ( item: Item ) => string;
	onClickItem?: ( item: Item ) => void;
	renderItemLink?: (
		props: {
			item: Item;
		} & ComponentProps< 'a' >
	) => ReactElement;
	isItemClickable: ( item: Item ) => boolean;
	item: Item;
	actions: Action< Item >[];
	titleField?: NormalizedField< Item >;
	mediaField?: NormalizedField< Item >;
	descriptionField?: NormalizedField< Item >;
	regularFields: NormalizedField< Item >[];
	badgeFields: NormalizedField< Item >[];
	hasBulkActions: boolean;
	config: {
		sizes: string;
	};
	posinset?: number;
}

function GridItem< Item >( {
	view,
	selection,
	onChangeSelection,
	onClickItem,
	isItemClickable,
	renderItemLink,
	getItemId,
	item,
	actions,
	mediaField,
	titleField,
	descriptionField,
	regularFields,
	badgeFields,
	hasBulkActions,
	config,
	posinset,
}: GridItemProps< Item > ) {
	const {
		showTitle = true,
		showMedia = true,
		showDescription = true,
		infiniteScrollEnabled,
	} = view;
	const hasBulkAction = useHasAPossibleBulkAction( actions, item );
	const id = getItemId( item );
	const instanceId = useInstanceId( GridItem );
	const isSelected = selection.includes( id );
	const renderedMediaField = mediaField?.render ? (
		<mediaField.render
			item={ item }
			field={ mediaField }
			config={ config }
		/>
	) : null;
	const renderedTitleField =
		showTitle && titleField?.render ? (
			<titleField.render item={ item } field={ titleField } />
		) : null;

	let mediaA11yProps;
	let titleA11yProps;
	if ( isItemClickable( item ) && onClickItem ) {
		if ( renderedTitleField ) {
			mediaA11yProps = {
				'aria-labelledby': `dataviews-view-grid__title-field-${ instanceId }`,
			};
			titleA11yProps = {
				id: `dataviews-view-grid__title-field-${ instanceId }`,
			};
		} else {
			mediaA11yProps = {
				'aria-label': __( 'Navigate to item' ),
			};
		}
	}
	const { paginationInfo } = useContext( DataViewsContext );

	return (
		<VStack
			spacing={ 0 }
			key={ id }
			className={ clsx( 'dataviews-view-grid__card', {
				'is-selected': hasBulkAction && isSelected,
			} ) }
			onClickCapture={ ( event ) => {
				if ( isAppleOS() ? event.metaKey : event.ctrlKey ) {
					event.stopPropagation();
					event.preventDefault();
					if ( ! hasBulkAction ) {
						return;
					}
					onChangeSelection(
						selection.includes( id )
							? selection.filter( ( itemId ) => id !== itemId )
							: [ ...selection, id ]
					);
				}
			} }
			role={ infiniteScrollEnabled ? 'article' : undefined }
			aria-setsize={
				infiniteScrollEnabled ? paginationInfo.totalItems : undefined
			}
			aria-posinset={ posinset }
		>
			{ showMedia && renderedMediaField && (
				<ItemClickWrapper
					item={ item }
					isItemClickable={ isItemClickable }
					onClickItem={ onClickItem }
					renderItemLink={ renderItemLink }
					className="dataviews-view-grid__media"
					{ ...mediaA11yProps }
				>
					{ renderedMediaField }
				</ItemClickWrapper>
			) }
			{ hasBulkActions && showMedia && renderedMediaField && (
				<DataViewsSelectionCheckbox
					item={ item }
					selection={ selection }
					onChangeSelection={ onChangeSelection }
					getItemId={ getItemId }
					titleField={ titleField }
					disabled={ ! hasBulkAction }
				/>
			) }
			<HStack
				justify="space-between"
				className="dataviews-view-grid__title-actions"
			>
				<ItemClickWrapper
					item={ item }
					isItemClickable={ isItemClickable }
					onClickItem={ onClickItem }
					renderItemLink={ renderItemLink }
					className="dataviews-view-grid__title-field dataviews-title-field"
					{ ...titleA11yProps }
				>
					{ renderedTitleField }
				</ItemClickWrapper>
				{ !! actions?.length && (
					<ItemActions item={ item } actions={ actions } isCompact />
				) }
			</HStack>
			<VStack spacing={ 1 }>
				{ showDescription && descriptionField?.render && (
					<descriptionField.render
						item={ item }
						field={ descriptionField }
					/>
				) }
				{ !! badgeFields?.length && (
					<HStack
						className="dataviews-view-grid__badge-fields"
						spacing={ 2 }
						wrap
						alignment="top"
						justify="flex-start"
					>
						{ badgeFields.map( ( field ) => {
							return (
								<Badge
									key={ field.id }
									className="dataviews-view-grid__field-value"
								>
									<field.render
										item={ item }
										field={ field }
									/>
								</Badge>
							);
						} ) }
					</HStack>
				) }
				{ !! regularFields?.length && (
					<VStack
						className="dataviews-view-grid__fields"
						spacing={ 1 }
					>
						{ regularFields.map( ( field ) => {
							return (
								<Flex
									className="dataviews-view-grid__field"
									key={ field.id }
									gap={ 1 }
									justify="flex-start"
									expanded
									style={ { height: 'auto' } }
									direction="row"
								>
									<>
										<Tooltip text={ field.label }>
											<FlexItem className="dataviews-view-grid__field-name">
												{ field.header }
											</FlexItem>
										</Tooltip>
										<FlexItem
											className="dataviews-view-grid__field-value"
											style={ { maxHeight: 'none' } }
										>
											<field.render
												item={ item }
												field={ field }
											/>
										</FlexItem>
									</>
								</Flex>
							);
						} ) }
					</VStack>
				) }
			</VStack>
		</VStack>
	);
}

function ViewGrid< Item >( {
	actions,
	data,
	fields,
	getItemId,
	isLoading,
	onChangeSelection,
	onClickItem,
	isItemClickable,
	renderItemLink,
	selection,
	view,
	className,
	empty,
}: ViewGridProps< Item > ) {
	const { resizeObserverRef } = useContext( DataViewsContext );
	const titleField = fields.find(
		( field ) => field.id === view?.titleField
	);
	const mediaField = fields.find(
		( field ) => field.id === view?.mediaField
	);
	const descriptionField = fields.find(
		( field ) => field.id === view?.descriptionField
	);
	const otherFields = view.fields ?? [];
	const { regularFields, badgeFields } = otherFields.reduce(
		(
			accumulator: Record< string, NormalizedField< Item >[] >,
			fieldId
		) => {
			const field = fields.find( ( f ) => f.id === fieldId );
			if ( ! field ) {
				return accumulator;
			}
			// If the field is a badge field, add it to the badgeFields array
			// otherwise add it to the rest visibleFields array.
			const key = view.layout?.badgeFields?.includes( fieldId )
				? 'badgeFields'
				: 'regularFields';
			accumulator[ key ].push( field );
			return accumulator;
		},
		{ regularFields: [], badgeFields: [] }
	);
	const hasData = !! data?.length;
	const hasBulkActions = useSomeItemHasAPossibleBulkAction( actions, data );
	const usedPreviewSize = view.layout?.previewSize;
	/*
	 * This is the maximum width that an image can achieve in the grid. The reasoning is:
	 * The biggest min image width available is 430px (see /dataviews-layouts/grid/preview-size-picker.tsx).
	 * Because the grid is responsive, once there is room for another column, the images shrink to accommodate it.
	 * So each image will never grow past 2*430px plus a little more to account for the gaps.
	 */
	const size = '900px';

	const groupField = view.groupByField
		? fields.find( ( f ) => f.id === view.groupByField )
		: null;

	// Group data by groupByField if specified
	const dataByGroup = groupField
		? data.reduce( ( groups: Map< string, typeof data >, item ) => {
				const groupName = groupField.getValue( { item } );
				if ( ! groups.has( groupName ) ) {
					groups.set( groupName, [] );
				}
				groups.get( groupName )?.push( item );
				return groups;
		  }, new Map< string, typeof data >() )
		: null;

	const isInfiniteScroll = view.infiniteScrollEnabled && ! dataByGroup;

	return (
		<>
			{
				// Render multiple groups.
				hasData && groupField && dataByGroup && (
					<VStack spacing={ 4 }>
						{ Array.from( dataByGroup.entries() ).map(
							( [ groupName, groupItems ] ) => (
								<VStack key={ groupName } spacing={ 2 }>
									<h3 className="dataviews-view-grid__group-header">
										{ sprintf(
											// translators: 1: The label of the field e.g. "Date". 2: The value of the field, e.g.: "May 2022".
											__( '%1$s: %2$s' ),
											groupField.label,
											groupName
										) }
									</h3>
									<div
										className={ clsx(
											'dataviews-view-grid',
											className
										) }
										style={ {
											gridTemplateColumns:
												usedPreviewSize &&
												`repeat(auto-fill, minmax(${ usedPreviewSize }px, 1fr))`,
										} }
										aria-busy={ isLoading }
										ref={ resizeObserverRef }
									>
										{ groupItems.map( ( item ) => {
											return (
												<GridItem
													key={ getItemId( item ) }
													view={ view }
													selection={ selection }
													onChangeSelection={
														onChangeSelection
													}
													onClickItem={ onClickItem }
													isItemClickable={
														isItemClickable
													}
													renderItemLink={
														renderItemLink
													}
													getItemId={ getItemId }
													item={ item }
													actions={ actions }
													mediaField={ mediaField }
													titleField={ titleField }
													descriptionField={
														descriptionField
													}
													regularFields={
														regularFields
													}
													badgeFields={ badgeFields }
													hasBulkActions={
														hasBulkActions
													}
													config={ {
														sizes: size,
													} }
												/>
											);
										} ) }
									</div>
								</VStack>
							)
						) }
					</VStack>
				)
			}

			{
				// Render a single grid with all data.
				hasData && ! dataByGroup && (
					<div
						className={ clsx( 'dataviews-view-grid', className ) }
						style={ {
							gridTemplateColumns:
								usedPreviewSize &&
								`repeat(auto-fill, minmax(${ usedPreviewSize }px, 1fr))`,
						} }
						aria-busy={ isLoading }
						ref={ resizeObserverRef }
						role={ isInfiniteScroll ? 'feed' : undefined }
					>
						{ data.map( ( item, index ) => {
							return (
								<GridItem
									key={ getItemId( item ) }
									view={ view }
									selection={ selection }
									onChangeSelection={ onChangeSelection }
									onClickItem={ onClickItem }
									isItemClickable={ isItemClickable }
									renderItemLink={ renderItemLink }
									getItemId={ getItemId }
									item={ item }
									actions={ actions }
									mediaField={ mediaField }
									titleField={ titleField }
									descriptionField={ descriptionField }
									regularFields={ regularFields }
									badgeFields={ badgeFields }
									hasBulkActions={ hasBulkActions }
									config={ {
										sizes: size,
									} }
									posinset={
										isInfiniteScroll ? index + 1 : undefined
									}
								/>
							);
						} ) }
					</div>
				)
			}
			{
				// Render empty state.
				! hasData && (
					<div
						className={ clsx( {
							'dataviews-loading': isLoading,
							'dataviews-no-results': ! isLoading,
						} ) }
					>
						<p>{ isLoading ? <Spinner /> : empty }</p>
					</div>
				)
			}
			{ hasData && isLoading && (
				<p className="dataviews-loading-more">
					<Spinner />
				</p>
			) }
		</>
	);
}

export default ViewGrid;
