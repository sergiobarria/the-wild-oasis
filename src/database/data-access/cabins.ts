import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';

import { db } from '../db';

export async function getCabins() {
	noStore();
	const data = await db.query.cabins.findMany({
		columns: { description: false, updatedAt: false },
		orderBy: (records, { desc }) => [desc(records.createdAt), desc(records.name)],
	});

	return data;
}
