/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { list, grid } from '@wordpress/icons';

const variations = [
	{
		name: 'list',
		title: __( 'List' ),
		description: __( 'Display terms in a list layout.' ),
		attributes: { blockLayout: 'list' },
		isDefault: true,
		icon: list,
		scope: [ 'block', 'inserter' ],
		innerBlocks: [
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						orientation: 'horizontal',
					},
					style: {
						spacing: {
							blockGap: '0.5rem',
						},
					},
					metadata: {
						name: __( 'Term Name with Count' ),
					},
				},
				[
					[
						'core/paragraph',
						{
							metadata: {
								name: __( 'Term Name' ),
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
							placeholder: __( '(count)' ),
							metadata: {
								name: __( 'Term Count' ),
								bindings: {
									content: {
										source: 'core/term-data',
										args: {
											key: 'count',
										},
									},
								},
							},
						},
					],
				],
			],
		],
	},
	{
		name: 'grid',
		title: __( 'Grid' ),
		description: __( 'Display terms in a grid layout.' ),
		attributes: { blockLayout: 'grid' },
		icon: grid,
		scope: [ 'block', 'inserter' ],
		innerBlocks: [
			[
				'core/group',
				{
					layout: {
						type: 'flex',
						orientation: 'horizontal',
					},
					style: {
						border: {
							width: '1px',
							style: 'solid',
							color: 'var(--wp--preset--color--border)',
						},
						borderRadius: '4px',
						padding: '1rem',
						spacing: {
							blockGap: '0.5rem',
						},
					},
					metadata: {
						name: __( 'Term Card' ),
					},
				},
				[
					[
						'core/paragraph',
						{
							style: {
								typography: {
									fontWeight: '600',
								},
							},
							metadata: {
								name: __( 'Term Name' ),
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
								name: __( 'Term Count' ),
								bindings: {
									content: {
										source: 'core/term-data',
										args: {
											key: 'count',
										},
									},
								},
							},
						},
					],
				],
			],
		],
	},
];

export default variations;
