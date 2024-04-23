import { db } from '$lib/db/db.server';

export async function load() {
	let cabins = await db.query.cabins.findMany({
		columns: {
			id: true,
			name: true,
			maxCapacity: true,
			price: true,
			discountPrice: true,
			image: true
		},
		orderBy: (cabins, { desc }) => [desc(cabins.createdAt), desc(cabins.name)]
	});

	// transform cabins data as needed
	cabins = cabins.map((cabin) => ({
		...cabin,
		image: cabin.image ? cabin.image : 'https://placehold.co/150x100'
	}));

	return { cabins };
}
