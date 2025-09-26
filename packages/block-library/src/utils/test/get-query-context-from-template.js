/**
 * Internal dependencies
 */
import { getQueryContextFromTemplate } from '../get-query-context-from-template';

describe( 'getQueryContextFromTemplate', () => {
	it( 'should return the correct query context based on template slug', () => {
		expect( getQueryContextFromTemplate() ).toStrictEqual( {
			isSingular: true,
		} );
		expect( getQueryContextFromTemplate( '404' ) ).toStrictEqual( {
			isSingular: true,
			templateQuery: null,
			templateType: '404',
		} );
		expect( getQueryContextFromTemplate( 'blank' ) ).toStrictEqual( {
			isSingular: true,
			templateQuery: null,
			templateType: 'blank',
		} );
		expect( getQueryContextFromTemplate( 'single' ) ).toStrictEqual( {
			isSingular: true,
			templateQuery: null,
			templateType: 'single',
		} );
		expect( getQueryContextFromTemplate( 'single-film' ) ).toStrictEqual( {
			isSingular: true,
			templateQuery: 'film',
			templateType: 'single',
		} );
		expect( getQueryContextFromTemplate( 'page' ) ).toStrictEqual( {
			isSingular: true,
			templateQuery: null,
			templateType: 'page',
		} );
		expect( getQueryContextFromTemplate( 'wp' ) ).toStrictEqual( {
			isSingular: true,
			templateQuery: null,
			templateType: 'custom',
		} );
		expect( getQueryContextFromTemplate( 'category' ) ).toStrictEqual( {
			isSingular: false,
			templateQuery: null,
			templateType: 'category',
		} );
		expect( getQueryContextFromTemplate( 'category-dog' ) ).toStrictEqual( {
			isSingular: false,
			templateQuery: 'dog',
			templateType: 'category',
		} );
		expect( getQueryContextFromTemplate( 'archive' ) ).toStrictEqual( {
			isSingular: false,
			templateQuery: null,
			templateType: 'archive',
		} );
		expect( getQueryContextFromTemplate( 'archive-film' ) ).toStrictEqual( {
			isSingular: false,
			templateQuery: 'film',
			templateType: 'archive',
		} );
	} );
} );
