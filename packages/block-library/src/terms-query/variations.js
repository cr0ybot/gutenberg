/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { link, titleLink, titleDescriptionLink } from './pattern-icons';

const variations = [
	{
		name: 'terms-query/link',
		title: __( 'Link' ),
		icon: link,
		attributes: {},
		innerBlocks: [
			[
				'core/term-template',
				{
					layout: {
						type: 'flex',
						orientation: 'vertical',
						justifyContent: 'stretch',
						flexWrap: 'nowrap',
					},
				},
				[
					[
						'core/buttons',
						{},
						[
							[
								'core/button',
								{
									text: __( 'View posts' ),
									metadata: {
										bindings: {
											url: {
												source: 'core/term-data',
												args: {
													key: 'link',
												},
											},
											text: {
												source: 'core/term-data',
												args: {
													key: 'name',
												},
											},
										},
									},
								},
							],
						],
					],
				],
			],
		],
	},
	{
		name: 'terms-query/title-link',
		title: __( 'Title & Link' ),
		icon: titleLink,
		attributes: {},
		innerBlocks: [
			[
				'core/term-template',
				{
					layout: {
						type: 'flex',
						orientation: 'vertical',
						justifyContent: 'stretch',
						flexWrap: 'nowrap',
					},
				},
				[
					[
						'core/heading',
						{
							metadata: {
								bindings: {
									content: {
										source: 'core/term-data',
										args: {
											key: 'name',
										},
									},
								},
							},
						},
					],
					[
						'core/buttons',
						{},
						[
							[
								'core/button',
								{
									text: __( 'View posts' ),
									metadata: {
										bindings: {
											url: {
												source: 'core/term-data',
												args: {
													key: 'link',
												},
											},
										},
									},
								},
							],
						],
					],
				],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'terms-query/title-description-link',
		title: __( 'Title, Description, & Link' ),
		icon: titleDescriptionLink,
		attributes: {},
		innerBlocks: [
			[
				'core/term-template',
				{
					layout: {
						type: 'flex',
						orientation: 'vertical',
						justifyContent: 'stretch',
						flexWrap: 'nowrap',
					},
				},
				[
					[
						'core/heading',
						{
							metadata: {
								bindings: {
									content: {
										source: 'core/term-data',
										args: {
											key: 'name',
										},
									},
								},
							},
						},
					],
					[
						'core/paragraph',
						{
							metadata: {
								bindings: {
									content: {
										source: 'core/term-data',
										args: {
											key: 'description',
										},
									},
								},
							},
						},
					],
					[
						'core/buttons',
						{},
						[
							[
								'core/button',
								{
									text: __( 'View posts' ),
									metadata: {
										bindings: {
											url: {
												source: 'core/term-data',
												args: {
													key: 'link',
												},
											},
										},
									},
								},
							],
						],
					],
				],
			],
		],
		scope: [ 'block' ],
	},
];

export default variations;
