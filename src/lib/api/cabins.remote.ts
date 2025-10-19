import z from 'zod';

import { query } from '$app/server';

export const getCabins = query(z.string().optional(), async (search) => {
	console.log('🚀 ~ search:', search);
	await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
	let results = cabins;

	if (search) {
		const lowerSearch = search.toLowerCase();
		results = results.filter((cabin) => cabin.name.toLowerCase().includes(lowerSearch));
	}
	return results;
});

const cabins = [
	{
		id: '01JABS9XK2M3N4P5Q6R7S8T9UV',
		name: 'Mountain View Retreat',
		slug: 'mountain-view-retreat',
		price_per_night: 250.0,
		discount_percentage: 10.0,
		summary: 'Spacious cabin with breathtaking mountain views and modern amenities',
		max_guests: 6,
		beds: 3,
		baths: 2,
		description:
			'Nestled in the heart of the Dolomites, this stunning cabin offers panoramic views of the surrounding peaks. Features include a fully equipped kitchen, cozy fireplace, and private balcony perfect for morning coffee.',
		created_at: '2024-01-15T10:30:00Z',
		updated_at: '2024-10-01T14:20:00Z'
	},
	{
		id: '01JABS9XK2M3N4P5Q6R7S8T9UW',
		name: 'Cozy Forest Cabin',
		slug: 'cozy-forest-cabin',
		price_per_night: 180.0,
		discount_percentage: null,
		summary: 'Intimate woodland escape perfect for couples',
		max_guests: 2,
		beds: 1,
		baths: 1,
		description:
			'A romantic getaway surrounded by pine trees. This charming cabin features rustic décor, a wood-burning stove, and a private hot tub under the stars.',
		created_at: '2024-01-20T09:15:00Z',
		updated_at: '2024-09-28T16:45:00Z'
	},
	{
		id: '01JABS9XK2M3N4P5Q6R7S8T9UX',
		name: 'Lakeside Family Lodge',
		slug: 'lakeside-family-lodge',
		price_per_night: 320.0,
		discount_percentage: 15.0,
		summary: 'Large family-friendly cabin by the lake with private dock',
		max_guests: 8,
		beds: 4,
		baths: 3,
		description:
			'Perfect for family gatherings! This spacious lodge offers direct lake access, a game room, expansive deck, and stunning sunset views. Kayaks and paddleboards included.',
		created_at: '2024-02-10T11:00:00Z',
		updated_at: '2024-10-05T12:30:00Z'
	},
	{
		id: '01JABS9XK2M3N4P5Q6R7S8T9UY',
		name: 'Alpine Luxury Suite',
		slug: 'alpine-luxury-suite',
		price_per_night: 450.0,
		discount_percentage: null,
		summary: 'Premium cabin with spa facilities and gourmet kitchen',
		max_guests: 4,
		beds: 2,
		baths: 2,
		description:
			"Experience ultimate luxury in the mountains. Features include a private sauna, jacuzzi, chef's kitchen with wine cellar, heated floors, and designer furnishings throughout.",
		created_at: '2024-03-01T08:45:00Z',
		updated_at: '2024-10-08T10:15:00Z'
	},
	{
		id: '01JABS9XK2M3N4P5Q6R7S8T9UZ',
		name: 'Rustic Mountain Hideaway',
		slug: 'rustic-mountain-hideaway',
		price_per_night: 150.0,
		discount_percentage: 20.0,
		summary: 'Budget-friendly cabin with authentic alpine charm',
		max_guests: 4,
		beds: 2,
		baths: 1,
		description:
			'A traditional cabin offering authentic mountain living. Simple but comfortable, with stunning hiking trails right from your doorstep. Perfect for adventurers.',
		created_at: '2024-02-28T13:20:00Z',
		updated_at: '2024-09-15T17:00:00Z'
	},
	{
		id: '01JABS9XK2M3N4P5Q6R7S8T9VA',
		name: 'Sunset Valley Cottage',
		slug: 'sunset-valley-cottage',
		price_per_night: 210.0,
		discount_percentage: null,
		summary: 'Charming cottage with valley views and garden terrace',
		max_guests: 5,
		beds: 2,
		baths: 2,
		description:
			'Enjoy spectacular sunsets from your private terrace. This cottage combines modern comfort with rustic elegance, featuring an outdoor dining area and herb garden.',
		created_at: '2024-03-15T15:30:00Z',
		updated_at: '2024-10-09T11:40:00Z'
	}
];
