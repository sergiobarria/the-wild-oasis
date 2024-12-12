import type { CollectionConfig } from 'payload';

export const Guests: CollectionConfig = {
	slug: 'guests',
	auth: true,
	fields: [
		{
			name: 'user',
			type: 'relationship',
			relationTo: 'users',
			required: true,
		},
		{
			name: 'firstName',
			type: 'text',
			label: 'First Name',
			required: true,
		},
		{
			name: 'lastName',
			type: 'text',
			label: 'Last Name',
			required: true,
		},
		{
			name: 'nationality',
			type: 'text',
			label: 'Nationality',
			required: true,
		},
		{
			name: 'country',
			type: 'text',
			label: 'Country',
			required: true,
		},
		{
			name: 'nationalId',
			type: 'text',
			label: 'National ID',
			required: true,
		},
	],
};
