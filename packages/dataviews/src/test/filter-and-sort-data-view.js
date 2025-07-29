/**
 * External dependencies
 */
import { subDays, subYears } from 'date-fns';

/**
 * Internal dependencies
 */
import { filterSortAndPaginate } from '../filter-and-sort-data-view';
import { data, fields } from '../components/dataviews/stories/fixtures';

describe( 'filters', () => {
	it( 'should return empty if the data is empty', () => {
		expect( filterSortAndPaginate( null, {}, [] ) ).toStrictEqual( {
			data: [],
			paginationInfo: { totalItems: 0, totalPages: 0 },
		} );
	} );

	it( 'should return the same data if no filters are applied', () => {
		expect(
			filterSortAndPaginate(
				data,
				{
					filters: [],
				},
				[]
			)
		).toStrictEqual( {
			data,
			paginationInfo: { totalItems: data.length, totalPages: 1 },
		} );
	} );

	it( 'should search using searchable fields (title)', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				search: 'Neptu',
				filters: [],
			},
			fields
		);
		expect( result ).toHaveLength( 1 );
		expect( result[ 0 ].title ).toBe( 'Neptune' );
	} );

	it( 'should search using searchable fields (description)', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				search: 'earth',
				filters: [],
			},
			fields
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].description ).toBe( "Earth's satellite" );
	} );

	it( 'should perform case-insensitive and accent-insensitive search', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				search: 'nete ven',
				filters: [],
			},
			fields
		);
		expect( result ).toHaveLength( 1 );
		expect( result[ 0 ].description ).toBe( 'La planète Vénus' );
	} );

	it( 'should search over array fields when enableGlobalSearch is true', () => {
		const fieldsWithArraySearch = fields.map( ( field ) =>
			field.id === 'categories'
				? { ...field, enableGlobalSearch: true }
				: field
		);

		const { data: result } = filterSortAndPaginate(
			data,
			{
				search: 'Moon',
				filters: [],
			},
			fieldsWithArraySearch
		);

		// Should find items with "satellite" in categories
		expect( result ).toHaveLength( 3 );
		expect( result.map( ( r ) => r.title ).sort() ).toEqual( [
			'Europa',
			'Io',
			'Moon',
		] );
	} );

	it( 'should search over array fields case-insensitively', () => {
		const fieldsWithArraySearch = fields.map( ( field ) =>
			field.id === 'categories'
				? { ...field, enableGlobalSearch: true }
				: field
		);

		const { data: result } = filterSortAndPaginate(
			data,
			{
				search: 'planet',
				filters: [],
			},
			fieldsWithArraySearch
		);

		// Should find items with "Planet" in categories (case-insensitive)
		expect( result ).toHaveLength( 8 );
		expect( result.map( ( r ) => r.title ) ).toContain( 'Neptune' );
		expect( result.map( ( r ) => r.title ) ).toContain( 'Mercury' );
		expect( result.map( ( r ) => r.title ) ).toContain( 'Earth' );
	} );

	it( 'should search using IS filter', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'type',
						operator: 'is',
						value: 'Ice giant',
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].title ).toBe( 'Neptune' );
		expect( result[ 1 ].title ).toBe( 'Uranus' );
	} );

	it( 'should search using IS NOT filter', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'type',
						operator: 'isNot',
						value: 'Ice giant',
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 9 );
		expect( result[ 0 ].title ).toBe( 'Moon' );
		expect( result[ 1 ].title ).toBe( 'Io' );
		expect( result[ 2 ].title ).toBe( 'Europa' );
		expect( result[ 3 ].title ).toBe( 'Mercury' );
		expect( result[ 4 ].title ).toBe( 'Venus' );
		expect( result[ 5 ].title ).toBe( 'Earth' );
		expect( result[ 6 ].title ).toBe( 'Mars' );
		expect( result[ 7 ].title ).toBe( 'Jupiter' );
		expect( result[ 8 ].title ).toBe( 'Saturn' );
	} );

	it( 'should search using IS ANY filter for STRING values', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'type',
						operator: 'isAny',
						value: [ 'Ice giant' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].title ).toBe( 'Neptune' );
		expect( result[ 1 ].title ).toBe( 'Uranus' );
	} );

	it( 'should search using IS NONE filter for STRING values', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'type',
						operator: 'isNone',
						value: [ 'Ice giant', 'Gas giant', 'Terrestrial' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 3 );
		expect( result[ 0 ].title ).toBe( 'Moon' );
		expect( result[ 1 ].title ).toBe( 'Io' );
		expect( result[ 2 ].title ).toBe( 'Europa' );
	} );

	it( 'should search using IS ANY filter for ARRAY values', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'categories',
						operator: 'isAny',
						value: [ 'Earth' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].title ).toBe( 'Moon' );
		expect( result[ 1 ].title ).toBe( 'Earth' );
	} );

	it( 'should search using IS NONE filter for ARRAY values', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'categories',
						operator: 'isNone',
						value: [ 'Terrestrial' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 7 );
		expect( result[ 0 ].title ).toBe( 'Moon' );
		expect( result[ 1 ].title ).toBe( 'Io' );
		expect( result[ 2 ].title ).toBe( 'Europa' );
		expect( result[ 3 ].title ).toBe( 'Neptune' );
		expect( result[ 4 ].title ).toBe( 'Jupiter' );
		expect( result[ 5 ].title ).toBe( 'Saturn' );
		expect( result[ 6 ].title ).toBe( 'Uranus' );
	} );

	it( 'should search using IS ALL filter', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'categories',
						operator: 'isAll',
						value: [ 'Planet', 'Solar system' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 8 );
		expect( result[ 0 ].title ).toBe( 'Neptune' );
		expect( result[ 1 ].title ).toBe( 'Mercury' );
		expect( result[ 2 ].title ).toBe( 'Venus' );
		expect( result[ 3 ].title ).toBe( 'Earth' );
		expect( result[ 4 ].title ).toBe( 'Mars' );
		expect( result[ 5 ].title ).toBe( 'Jupiter' );
		expect( result[ 6 ].title ).toBe( 'Saturn' );
		expect( result[ 7 ].title ).toBe( 'Uranus' );
	} );

	it( 'should search using IS NOT ALL filter', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'categories',
						operator: 'isNotAll',
						value: [ 'Planet' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 3 );
		expect( result[ 0 ].title ).toBe( 'Moon' );
		expect( result[ 1 ].title ).toBe( 'Io' );
		expect( result[ 2 ].title ).toBe( 'Europa' );
	} );

	it( 'should search using IS filter and return all values if filter.value is undefined', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'type',
						operator: 'is',
						value: undefined,
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 11 );
		expect( result[ 0 ].title ).toBe( 'Moon' );
		expect( result[ 1 ].title ).toBe( 'Io' );
		expect( result[ 2 ].title ).toBe( 'Europa' );
		expect( result[ 3 ].title ).toBe( 'Neptune' );
		expect( result[ 4 ].title ).toBe( 'Mercury' );
		expect( result[ 5 ].title ).toBe( 'Venus' );
		expect( result[ 6 ].title ).toBe( 'Earth' );
		expect( result[ 7 ].title ).toBe( 'Mars' );
		expect( result[ 8 ].title ).toBe( 'Jupiter' );
		expect( result[ 9 ].title ).toBe( 'Saturn' );
		expect( result[ 10 ].title ).toBe( 'Uranus' );
	} );

	it( 'should filter using LESS THAN operator for integer', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'lessThan',
						value: 2,
					},
				],
			},
			fields
		);
		expect( result.every( ( item ) => item.satellites < 2 ) ).toBe( true );
	} );

	it( 'should filter using GREATER THAN operator for integer', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'greaterThan',
						value: 10,
					},
				],
			},
			fields
		);
		expect( result.every( ( item ) => item.satellites > 10 ) ).toBe( true );
	} );

	it( 'should filter using LESS THAN OR EQUAL operator for integer', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'lessThanOrEqual',
						value: 1,
					},
				],
			},
			fields
		);
		expect( result.every( ( item ) => item.satellites <= 1 ) ).toBe( true );
	} );

	it( 'should filter using GREATER THAN OR EQUAL operator for integer', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'greaterThanOrEqual',
						value: 27,
					},
				],
			},
			fields
		);
		expect( result.every( ( item ) => item.satellites >= 27 ) ).toBe(
			true
		);
	} );

	it( 'should filter using CONTAINS operator for text fields', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'title',
						operator: 'contains',
						value: 'nep',
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 1 );
		expect( result[ 0 ].title ).toBe( 'Neptune' );
	} );

	it( 'should filter using NOT_CONTAINS operator for text fields', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'description',
						operator: 'notContains',
						value: 'Solar system',
					},
				],
			},
			fields
		);
		expect( result.map( ( r ) => r.description ) ).toEqual( [
			"Earth's satellite",
			'Moon of Jupiter',
			'Moon of Jupiter',
			'La planète Vénus',
		] );
	} );

	it( 'should filter using STARTS_WITH operator for text fields', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'title',
						operator: 'startsWith',
						value: 'Mar',
					},
				],
			},
			fields
		);
		expect( result.map( ( r ) => r.title ) ).toContain( 'Mars' );
	} );

	it( 'should filter using BEFORE operator for datetime', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'before',
						value: '2020-01-01',
					},
				],
			},
			fields
		);
		expect(
			result.every(
				( item ) => new Date( item.date ) < new Date( '2020-01-01' )
			)
		).toBe( true );
	} );

	it( 'should filter using AFTER operator for datetime', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'after',
						value: '2020-01-01',
					},
				],
			},
			fields
		);
		expect(
			result.every(
				( item ) => new Date( item.date ) > new Date( '2020-01-01' )
			)
		).toBe( true );
	} );

	it( 'should filter using BEFORE (inc) operator for datetime', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'beforeInc',
						value: '2020-01-01',
					},
				],
			},
			fields
		);
		expect(
			result.every(
				( item ) => new Date( item.date ) <= new Date( '2020-01-01' )
			)
		).toBe( true );
	} );

	it( 'should filter using AFTER (inc) operator for datetime', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'afterInc',
						value: '2020-01-01',
					},
				],
			},
			fields
		);
		expect(
			result.every(
				( item ) => new Date( item.date ) >= new Date( '2020-01-01' )
			)
		).toBe( true );
	} );

	it( 'should filter using ON operator for datetime with exact date match', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'on',
						value: '2020-01-01',
					},
				],
			},
			fields
		);
		expect( result.length ).toBe( 2 );
		expect( result[ 0 ].title ).toBe( 'Neptune' );
	} );

	it( 'should filter using ON operator for datetime with different date formats', () => {
		// Test that '2019-03-01T00:00:00Z' matches '2019-03-01'
		const testData = [
			{ title: 'Test Item 1', date: '2019-03-01T00:00:00Z' },
			{ title: 'Test Item 2', date: '2019-03-02' },
		];
		const testFields = [
			{
				id: 'date',
				type: 'datetime',
				getValue: ( { item } ) => item.date,
			},
		];

		const { data: result } = filterSortAndPaginate(
			testData,
			{
				filters: [
					{
						field: 'date',
						operator: 'on',
						value: '2019-03-01',
					},
				],
			},
			testFields
		);
		expect( result.length ).toBe( 1 );
		expect( result[ 0 ].title ).toBe( 'Test Item 1' );
	} );

	it( 'should filter using NOT_ON operator for datetime', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'notOn',
						value: '2020-01-01',
					},
				],
			},
			fields
		);
		expect( result.length ).toBe( 9 );
		expect( result.map( ( r ) => r.title ) ).not.toContain( 'Neptune' );
	} );

	it( 'should filter using NOT_ON operator for datetime with different date formats', () => {
		// Test that '2019-03-01T00:00:00Z' does not match '2019-03-02'
		const testData = [
			{ title: 'Test Item 1', date: '2019-03-01T00:00:00Z' },
			{ title: 'Test Item 2', date: '2019-03-02T00:00:00Z' },
		];
		const testFields = [
			{
				id: 'date',
				type: 'datetime',
				getValue: ( { item } ) => item.date,
			},
		];

		const { data: result } = filterSortAndPaginate(
			testData,
			{
				filters: [
					{
						field: 'date',
						operator: 'notOn',
						value: '2019-03-01',
					},
				],
			},
			testFields
		);
		expect( result.length ).toBe( 1 );
		expect( result[ 0 ].title ).toBe( 'Test Item 2' );
	} );

	it( 'should filter numbers inclusively between min and max using BETWEEN operator', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'between',
						value: [ 10, 30 ],
					},
				],
			},
			fields
		);
		expect( result.map( ( r ) => r.title ).sort() ).toEqual( [
			'Neptune',
			'Uranus',
		] );
	} );

	it( 'should filter numbers inclusively at the edges using BETWEEN operator', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'between',
						value: [ 28, 28 ],
					},
				],
			},
			fields
		);
		expect( result.map( ( r ) => r.title ) ).toEqual( [ 'Uranus' ] );
	} );

	it( 'should filter dates inclusively between min and max using BETWEEN operator', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'date',
						operator: 'between',
						value: [ '1977-08-20', '1989-08-25' ],
					},
				],
			},
			fields
		);
		const allInRange = result.every(
			( r ) => r.date >= '1977-08-20' && r.date <= '1989-08-25'
		);
		expect( allInRange ).toBe( true );
	} );

	it( 'should return no results if min > max using BETWEEN operator', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				filters: [
					{
						field: 'satellites',
						operator: 'between',
						value: [ 30, 10 ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 0 );
	} );

	it( 'should filter using IN_THE_PAST operator for datetime (days)', () => {
		const testData = [
			{ title: 'Recent', date: subDays( new Date(), 5 ) },
			{ title: 'Old', date: subDays( new Date(), 14 ) },
		];
		const testFields = [ { id: 'date', type: 'datetime', label: 'Date' } ];
		const { data: result } = filterSortAndPaginate(
			testData,
			{
				filters: [
					{
						field: 'date',
						operator: 'inThePast',
						value: { value: 7, unit: 'days' },
					},
				],
			},
			testFields
		);
		expect( result ).toHaveLength( 1 );
		expect( result ).toStrictEqual( [ testData[ 0 ] ] );
	} );

	it( 'should filter using OVER operator for datetime (days)', () => {
		const testData = [
			{ title: 'Recent', date: subDays( new Date(), 5 ) },
			{ title: 'Old', date: subDays( new Date(), 14 ) },
		];
		const testFields = [ { id: 'date', type: 'datetime', label: 'Date' } ];
		const { data: result } = filterSortAndPaginate(
			testData,
			{
				filters: [
					{
						field: 'date',
						operator: 'over',
						value: { value: 10, unit: 'days' },
					},
				],
			},
			testFields
		);
		expect( result ).toHaveLength( 1 );
		expect( result ).toStrictEqual( [ testData[ 1 ] ] );
	} );

	it( 'should filter using IN_THE_PAST operator for datetime (years)', () => {
		const testData = [
			{ title: 'Recent', date: subYears( new Date(), 1 ) },
			{ title: 'Old', date: subYears( new Date(), 5 ) },
		];
		const testFields = [ { id: 'date', type: 'datetime', label: 'Date' } ];
		const { data: result } = filterSortAndPaginate(
			testData,
			{
				filters: [
					{
						field: 'date',
						operator: 'inThePast',
						value: { value: 3, unit: 'years' },
					},
				],
			},
			testFields
		);
		expect( result ).toHaveLength( 1 );
		expect( result ).toStrictEqual( [ testData[ 0 ] ] );
	} );

	it( 'should filter using OVER operator for datetime (years)', () => {
		const testData = [
			{ title: 'Recent', date: subYears( new Date(), 1 ) },
			{ title: 'Old', date: subYears( new Date(), 5 ) },
		];
		const testFields = [ { id: 'date', type: 'datetime', label: 'Date' } ];
		const { data: result } = filterSortAndPaginate(
			testData,
			{
				filters: [
					{
						field: 'date',
						operator: 'over',
						value: { value: 3, unit: 'years' },
					},
				],
			},
			testFields
		);
		expect( result ).toHaveLength( 1 );
		expect( result ).toStrictEqual( [ testData[ 1 ] ] );
	} );
} );

describe( 'sorting', () => {
	it( 'should sort by groupByField first, then by sort.field', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'title', direction: 'desc' },
				groupByField: 'type',
			},
			fields
		);

		expect( result ).toHaveLength( 11 );

		expect( result[ 0 ].type ).toBe( 'Gas giant' );
		expect( result[ 0 ].title ).toBe( 'Saturn' );
		expect( result[ 1 ].type ).toBe( 'Gas giant' );
		expect( result[ 1 ].title ).toBe( 'Jupiter' );

		expect( result[ 2 ].type ).toBe( 'Ice giant' );
		expect( result[ 2 ].title ).toBe( 'Uranus' );
		expect( result[ 3 ].type ).toBe( 'Ice giant' );
		expect( result[ 3 ].title ).toBe( 'Neptune' );

		expect( result[ 4 ].type ).toBe( 'Satellite' );
		expect( result[ 4 ].title ).toBe( 'Moon' );
		expect( result[ 5 ].type ).toBe( 'Satellite' );
		expect( result[ 5 ].title ).toBe( 'Io' );
		expect( result[ 6 ].type ).toBe( 'Satellite' );
		expect( result[ 6 ].title ).toBe( 'Europa' );

		expect( result[ 7 ].type ).toBe( 'Terrestrial' );
		expect( result[ 7 ].title ).toBe( 'Venus' );
		expect( result[ 8 ].type ).toBe( 'Terrestrial' );
		expect( result[ 8 ].title ).toBe( 'Mercury' );
		expect( result[ 9 ].type ).toBe( 'Terrestrial' );
		expect( result[ 9 ].title ).toBe( 'Mars' );
		expect( result[ 10 ].type ).toBe( 'Terrestrial' );
		expect( result[ 10 ].title ).toBe( 'Earth' );
	} );

	it( 'should sort integer field types', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'satellites', direction: 'desc' },
			},
			fields
		);

		expect( result ).toHaveLength( 11 );
		expect( result[ 0 ].title ).toBe( 'Saturn' );
		expect( result[ 1 ].title ).toBe( 'Jupiter' );
		expect( result[ 2 ].title ).toBe( 'Uranus' );
	} );

	it( 'should sort text field types', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'title', direction: 'desc' },
				filters: [
					{
						field: 'type',
						operator: 'isAny',
						value: [ 'Ice giant' ],
					},
				],
			},
			fields
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].title ).toBe( 'Uranus' );
		expect( result[ 1 ].title ).toBe( 'Neptune' );
	} );

	it( 'should sort datetime field types', () => {
		const { data: resultDesc } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'date', direction: 'desc' },
			},
			fields
		);
		expect( resultDesc ).toHaveLength( 11 );
		expect( resultDesc[ 0 ].title ).toBe( 'Europa' );
		expect( resultDesc[ 1 ].title ).toBe( 'Earth' );
		expect( resultDesc[ 9 ].title ).toBe( 'Io' );
		expect( resultDesc[ 10 ].title ).toBe( 'Jupiter' );

		const { data: resultAsc } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'date', direction: 'asc' },
			},
			fields
		);
		expect( resultAsc ).toHaveLength( 11 );
		expect( resultAsc[ 0 ].title ).toBe( 'Jupiter' );
		expect( resultAsc[ 1 ].title ).toBe( 'Io' );
		expect( resultAsc[ 9 ].title ).toBe( 'Earth' );
		expect( resultAsc[ 10 ].title ).toBe( 'Europa' );
	} );

	it( 'should sort untyped fields if the value is a number', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'satellites', direction: 'desc' },
			},
			// Remove type information for satellites field to test sorting untyped fields.
			fields.map( ( field ) =>
				field.id === 'satellites'
					? { ...field, type: undefined }
					: field
			)
		);

		expect( result ).toHaveLength( 11 );
		expect( result[ 0 ].title ).toBe( 'Saturn' );
		expect( result[ 1 ].title ).toBe( 'Jupiter' );
		expect( result[ 2 ].title ).toBe( 'Uranus' );
	} );

	it( 'should sort untyped fields if the value is string', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				sort: { field: 'title', direction: 'desc' },
				filters: [
					{
						field: 'type',
						operator: 'isAny',
						value: [ 'Ice giant' ],
					},
				],
			},
			// Remove type information for the title field to test sorting untyped fields.
			fields.map( ( field ) =>
				field.id === 'title' ? { ...field, type: undefined } : field
			)
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].title ).toBe( 'Uranus' );
		expect( result[ 1 ].title ).toBe( 'Neptune' );
	} );

	it( 'should sort only by groupByField when sort is not specified', () => {
		const { data: result } = filterSortAndPaginate(
			data,
			{
				groupByField: 'type',
			},
			fields
		);

		let currentType = result[ 0 ].type;
		let groupCount = 1;

		for ( let i = 1; i < result.length; i++ ) {
			if ( result[ i ].type !== currentType ) {
				currentType = result[ i ].type;
				groupCount++;
			}
		}

		expect( groupCount ).toBe( 4 );
	} );
} );

describe( 'pagination', () => {
	it( 'should paginate', () => {
		const { data: result, paginationInfo } = filterSortAndPaginate(
			data,
			{
				perPage: 2,
				page: 2,
				filters: [],
			},
			fields
		);
		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ].title ).toBe( 'Europa' );
		expect( result[ 1 ].title ).toBe( 'Neptune' );
		expect( paginationInfo ).toStrictEqual( {
			totalItems: data.length,
			totalPages: 6,
		} );
	} );
} );
