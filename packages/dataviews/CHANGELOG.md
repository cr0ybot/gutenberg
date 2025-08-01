<!-- Learn how to maintain this file at https://github.com/WordPress/gutenberg/tree/HEAD/packages#maintaining-changelogs. -->

## Unreleased

### Breaking changes

- Field API: `isValid` is now an object that contains `required` and `custom` validation rules. Additionally, fields should now opt-in into being a "required" field by setting `isValid.required` to `true` (all fields of type `email` and `integer` were required by default). [#70901](https://github.com/WordPress/gutenberg/pull/70901)

### Bug Fixes

- Do not render an empty `&nbsp;` when the title field has level 0. [#71021](https://github.com/WordPress/gutenberg/pull/71021)
- Set minimum and maximum number of items in `pePageSizes`, so that the UI control is disabled when the list exceeds those limits. [#71004](https://github.com/WordPress/gutenberg/pull/71004)
- Fix `filterSortAndPaginate` to handle searching fields that have a type of `array` ([#70785](https://github.com/WordPress/gutenberg/pull/70785)).
- Fix user-input filters: empty value for text and integer filters means there's no value to search for (so it returns all items). It also fixes a type conversion where empty strings for integer were converted to 0 [#70956](https://github.com/WordPress/gutenberg/pull/70956/).

### Features

- Support Ctrl + Click / Cmd + Click for multiselecting rows in the Table layout ([#70891](https://github.com/WordPress/gutenberg/pull/70891)).
- Add support for the `Edit` control on the date field type ([#70836](https://github.com/WordPress/gutenberg/pull/70836)).
- Add support for responsive image attributes in media fields by adding a `config` prop to `mediaField.render`, containing a `sizes` string. Also simplifies grid logic and fixes imprecisions in grid resizing by changing the observed container. ([#70493](https://github.com/WordPress/gutenberg/pull/70493)).

### Enhancements

- Make the media item clickable along the title ([#70985](https://github.com/WordPress/gutenberg/pull/70985)).

## 5.0.0 (2025-07-23)

### Bug Fixes

- Fix `filterSortAndPaginate` to handle undefined values for the `is` filter.
- Fix the background color of the action column if the row is selected

### Features

- Add support for grouping items by a field in the `grid` layout by introducing a `groupByField` prop in the View object.
- Add support for free composition in the `DataViews` component by exporting subcomponents: `<DataViews.ViewConfig />`, `<DataViews.Search />`, `<DataViews.Pagination />`, `<DataViews.LayoutSwitcher />`, `<DataViews.Layout />`, `<DataViews.FiltersToggle />`, `<DataViews.Filters />`, `<DataViews.BulkActionToolbar />`.
- `select`, `text`, `email` controls: add `help` support from the field `description` prop.
- `text`, `email` Edit control: add `help` support from the field `description` prop.
- Add new Edit controls: `checkbox`, `toggleGroup`. In the `toggleGroup`, if the field elements (options) have a `description`, then the selected option's description will be also rendered.
- Add new `media`, `boolean`, `email`, `array` and `date` field type definitions.
- Field type definitions are now able to define a default `enableSorting` and `render` function.
- Pin the actions column on the table view when the width is insufficient.
- Enhance filter component styles.
- Add user input filter support based on the `Edit` property of the field type definitions.
- Add new filter operators: `lessThan`, `greaterThan`, `lessThanOrEqual`, `greaterThanOrEqual`, `contains`, `notContains`, `startsWith`, `between`, `on`, `notOn`, `before`, `after`, `inThePast`, `over`, `beforeInc`, and `afterInc`.
- Add `align` to the `layout.styles` properties, for use in the DataViews table layout. Options are: `start`, `center`, and `end`.
- Allow fields to opt-out of filtering via `field.filterBy: false`.
- Update the field type definitions to declare the default and valid operators they support. Fields with no `type` property can use all operators; if none is provided in the field's config, they'll use `is` and `isNot` by default.
- Adjust the spacing of the `DataForm` based on the type.
- Add `label-position-side` classes to labels in the form field layouts. Ensure that labels in the panel view do not align center, and that all side labels are center aligned.
- Allow readonly fields in DataForm when `readOnly` is set to `true`.
- Adjust the padding when the component is placed inside a `Card`.
- Introduce `perPageSizes` to control the available sizes of the items per page.
- Align media styles in table view with list view for consistency.

### Breaking Changes

- Fields with `Edit` defined or `type` will automatically be considered as filters unless `filterBy` is set to `false`.
- Add `renderItemLink` prop support in the `DataViews` component. It replaces `onClickItem`prop and allows integration with router libraries.

### Internal

- Adds new story that combines DataViews and DataForm.
- Add a story for each FieldTypeDefinition.

## 4.22.0 (2025-06-25)

## 4.21.0 (2025-06-04)

## 4.20.0 (2025-05-22)

## 4.19.0 (2025-05-07)

## 4.18.0 (2025-04-11)

## 4.17.0 (2025-03-27)

## 4.16.0 (2025-03-13)

## 4.15.0 (2025-02-28)

## 4.14.0 (2025-02-12)

## 4.13.0 (2025-01-29)

## 4.12.0 (2025-01-15)

## 4.11.0 (2025-01-02)

### Bug Fixes

-   Fixed commonjs export ([#67962](https://github.com/WordPress/gutenberg/pull/67962))

### Features

- Add support for hierarchical visualization of data. `DataViews` gets a new prop `getItemLevel` that should return the hierarchical level of the item. The view can use `view.showLevels` to display the levels. It's up to the consumer data source to prepare this information.

## 4.10.0 (2024-12-11)

### Breaking Changes

-   Support showing or hiding title, media and description fields ([#67477](https://github.com/WordPress/gutenberg/pull/67477)).
-   Unify the `title`, `media` and `description` fields for the different layouts. So instead of the previous `view.layout.mediaField`, `view.layout.primaryField` and `view.layout.columnFields`, all the layouts now support these three fields with the following config ([#67477](https://github.com/WordPress/gutenberg/pull/67477)):

```js
const view = {
	type: 'table',
	titleField: 'title',
	mediaField: 'media',
	descriptionField: 'description',
	fields: [ 'author', 'date' ],
};
```

### Internal

-   Upgraded `@ariakit/react` (v0.4.13) and `@ariakit/test` (v0.4.5) ([#65907](https://github.com/WordPress/gutenberg/pull/65907)).
-   Upgraded `@ariakit/react` (v0.4.15) and `@ariakit/test` (v0.4.7) ([#67404](https://github.com/WordPress/gutenberg/pull/67404)).

## 4.9.0 (2024-11-27)

### Bug Fixes

-   Fix focus loss when removing all filters or resetting ([#67003](https://github.com/WordPress/gutenberg/pull/67003)).

## 4.8.0 (2024-11-16)

## 4.7.0 (2024-10-30)

## 4.6.0 (2024-10-16)

-   Invert the logic for which icon to show in `DataViews` when using the filter view. Icons now match the action of the button label. ([#65914](https://github.com/WordPress/gutenberg/pull/65914)).

## 4.5.0 (2024-10-03)

## 4.4.0 (2024-09-19)

## 4.3.0 (2024-09-05)

## 4.2.0 (2024-08-21)

## New features

-   Support using a component for field headers or names by providing a `header` property in the field object. The string `label` property (or `id`) is still mandatory. ([#64642](https://github.com/WordPress/gutenberg/pull/64642)).

## Internal

-   The "move left/move right" controls in the table layout (popup displayed on cliking header) are always visible. ([#64646](https://github.com/WordPress/gutenberg/pull/64646)). Before this, its visibility depending on filters, enableSorting, and enableHiding.
-   Filters no longer display the elements' description. ([#64674](https://github.com/WordPress/gutenberg/pull/64674))

## Enhancements

-   Adjust layout of filter / actions row, increase width of search control when the container is narrower. ([#64681](https://github.com/WordPress/gutenberg/pull/64681)).

## 4.1.0 (2024-08-07)

## Internal

-   Upgraded `@ariakit/react` (v0.4.7) ([#64066](https://github.com/WordPress/gutenberg/pull/64066)).

## 4.0.0 (2024-07-24)

### Breaking Changes

-   `onSelectionChange` prop has been renamed to `onChangeSelection` and its argument has been updated to be a list of ids.
-   `setSelection` prop has been removed. Please use `onChangeSelection` instead.
-   `header` field property has been renamed to `label`.
-   `DataForm`'s `visibleFields` prop has been renamed to `fields`.
-   `DataForm`'s `onChange` prop has been update to receive as argument only the fields that have changed.

### New features

-   Support multiple layouts in `DataForm` component and introduce the `panel` layout.

## 3.0.0 (2024-07-10)

### Breaking Changes

-   Replace the `hiddenFields` property in the view prop of `DataViews` with a `fields` property that accepts an array of visible fields instead.
-   Replace the `supportedLayouts` prop in the `DataViews` component with a `defaultLayouts` prop that accepts an object whose keys are the layout names and values are the default view objects for these layouts.

### New features

-   Added a new `DataForm` component to render controls from a given configuration (fields, form), and data.

### Internal

-   Method style type signatures have been changed to function style ([#62718](https://github.com/WordPress/gutenberg/pull/62718)).

## 2.2.0 (2024-06-26)

## 2.1.0 (2024-06-15)

## 2.0.0 (2024-05-31)

### Breaking Changes

-   Legacy support for `in` and `notIn` operators introduced in 0.8 .0 has been removed and they no longer work. Please, convert them to `is` and `isNot` respectively.
-   Variables like `process.env.IS_GUTENBERG_PLUGIN` have been replaced by `globalThis.IS_GUTENBERG_PLUGIN`. Build systems using `process.env` should be updated ([#61486](https://github.com/WordPress/gutenberg/pull/61486)).
-   Increase the minimum required Node.js version to v18.12.0 matching long-term support releases ([#31270](https://github.com/WordPress/gutenberg/pull/61930)). Learn more about [Node.js releases](https://nodejs.org/en/about/previous-releases).

### Internal

-   Remove some unused dependencies ([#62010](https://github.com/WordPress/gutenberg/pull/62010)).

### Enhancements

-   `label` prop in Actions API can be either a `string` value or a `function`, in case we want to use information from the selected items. ([#61942](https://github.com/WordPress/gutenberg/pull/61942)).
-   Add `registry` argument to the callback of the actions API. ([#62505](https://github.com/WordPress/gutenberg/pull/62505)).

## 1.2.0 (2024-05-16)

### Internal

-   Replaced `classnames` package with the faster and smaller `clsx` package ([#61138](https://github.com/WordPress/gutenberg/pull/61138)).

## 1.1.0 (2024-05-02)

## 1.0.0 (2024-04-19)

### Breaking Changes

-   Removed the `onDetailsChange` event only available for the list layout. We are looking into adding actions to the list layout, including primary ones.

## 0.9.0 (2024-04-03)

### Enhancements

-   The `enumeration` type has been removed and we'll introduce new field types soon. The existing filters will still work as before given they checked for field.elements, which is still a condition filters should have.

## 0.8.0 (2024-03-21)

### Enhancements

-   Two new operators have been added: `isAll` and `isNotAll`. These are meant to represent `AND` operations. For example, `Category is all: Book, Review, Science Fiction` would represent all items that have all three categories selected.
-   DataViews now supports multi-selection. A new set of filter operators has been introduced: `is`, `isNot`, `isAny`, `isNone`. Single-selection operators are `is` and `isNot`, and multi-selection operators are `isAny` and `isNone`. If no operators are declared for a filter, it will support multi-selection. Additionally, the old filter operators `in` and `notIn` operators have been deprecated and will work as `is` and `isNot` respectively. Please, migrate to the new operators as they'll be removed soon.

### Breaking Changes

-   Removed the `getPaginationResults` and `sortByTextFields` utils and replaced them with a unique `filterSortAndPaginate` function.

## 0.7.0 (2024-03-06)

## 0.6.0 (2024-02-21)

## 0.5.0 (2024-02-09)

## 0.4.0 (2024-01-24)

## 0.3.0 (2024-01-10)

## 0.2.0 (2023-12-13)
