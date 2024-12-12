import type { CollectionConfig } from 'payload';

export const Cabins: CollectionConfig = {
	slug: 'cabins',
	admin: {
		useAsTitle: 'name',
	},
	auth: false, // TODO: Change to true
	fields: [
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			required: true,
		},
		{
			type: 'row',
			fields: [
				{
					name: 'maxCapacity',
					type: 'number',
					label: 'Max Capacity',
					min: 1,
					max: 30,
					required: true,
				},
				{
					name: 'price',
					type: 'number',
					label: 'Regular Price',
					required: true,
				},
				{
					name: 'discount',
					type: 'number',
					label: 'Discount (%)',
					min: 0,
					max: 100,
				},
			],
		},
		{
			type: 'upload',
			relationTo: 'media',
			name: 'images',
			hasMany: true,
			label: 'Cabin Images',
		},
		{
			name: 'description',
			type: 'richText',
			label: 'Description',
		},
		{
			name: 'published',
			type: 'checkbox',
			label: 'Published',
			admin: {
				position: 'sidebar',
			},
		},
	],
};
