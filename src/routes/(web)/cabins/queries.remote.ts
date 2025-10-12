import * as v from 'valibot';

import { query } from '$app/server';

import { amenities } from '../../../../data/data-amenities';
import { cabins } from '../../../../data/data-cabins';
import { reviews } from '../../../../data/data-reviews';

export const getCabins = query(async () => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return cabins;
});

export const getCabin = query(v.string(), async (slug) => {
	const cabin = cabins.find((cabin) => cabin.slug === slug);

	return {
		cabin,
		reviews: reviews.slice(0, 3),
		amenities: amenities.slice(0, 8),
		recommended: cabins.filter((cabin) => cabin.slug !== slug).slice(0, 3)
	};
});
