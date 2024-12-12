import type { CollectionConfig } from 'payload';

export const Settings: CollectionConfig = {
	slug: 'settings',
	admin: {
		// useAsTitle: 'name',
	},
	auth: false, // TODO: Change to true
	fields: [
		{
			name: 'minBookingLength',
			type: 'number',
			required: true,
		},
		{
			name: 'maxBookingLength',
			type: 'number',
			required: true,
		},
		{
			name: 'maxGuests',
			type: 'number',
			required: true,
			min: 1,
		},
		{
			name: 'breakfastPrice',
			type: 'number',
			required: true,
			min: 0,
		},
	],
};
