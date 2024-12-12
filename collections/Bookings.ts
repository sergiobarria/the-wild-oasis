import type { CollectionConfig } from 'payload';

export const Bookings: CollectionConfig = {
	slug: 'bookings',
	admin: {
		// useAsTitle: 'name',
	},
	auth: false, // TODO: Change to true
	fields: [
		{
			name: 'cabin',
			type: 'relationship',
			relationTo: 'cabins',
			label: 'Cabin',
		},
		{
			name: 'guest',
			type: 'relationship',
			relationTo: 'guests',
			label: 'Guest',
		},
		{
			type: 'row',
			fields: [
				{
					name: 'startDate',
					type: 'date',
					required: true,
					label: 'Start Date',
				},
				{
					name: 'endDate',
					type: 'date',
					required: true,
					label: 'End Date',
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					name: 'numOfNights',
					type: 'number',
					min: 1,
					required: true,
					label: 'Number of Nights',
				},
				{
					name: 'numOfGuests',
					type: 'number',
					min: 1,
					required: true,
					label: 'Number of Guests',
				},
			],
		},
		{
			type: 'row',
			fields: [
				{
					name: 'cabinPrice',
					type: 'number',
					required: true,
					label: 'Cabin Price',
				},
				{
					name: 'extrasPrice',
					type: 'number',
					required: true,
					label: 'Extras Price',
				},
				{
					name: 'totalPrice',
					type: 'number',
					required: true,
					label: 'Total Price',
				},
			],
		},
		{
			name: 'status',
			type: 'select',
			options: [
				{ label: 'Pending', value: 'pending' },
				{ label: 'Confirmed', value: 'confirmed' },
				{ label: 'Cancelled', value: 'cancelled' },
			],
			defaultValue: 'pending',
		},
		{
			name: 'hasBreakfast',
			type: 'checkbox',
			label: 'Has Breakfast',
		},
		{
			name: 'isPaid',
			type: 'checkbox',
			label: 'Is Paid',
		},
		{
			name: 'observations',
			type: 'textarea',
			label: 'Observations',
		},
	],
};
