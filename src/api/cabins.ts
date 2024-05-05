import { Query } from 'appwrite';

import { databases } from '@/lib/appwrite';
import { env } from '@/env';

const DATABASE_ID = env.VITE_DATABASE_ID;
const CABINS_COLLECTION_ID = env.VITE_COLLECTION_ID_CABINS;

export async function getAllCabins() {
	const results = await databases.listDocuments(DATABASE_ID, CABINS_COLLECTION_ID, [
		Query.orderDesc('$createdAt'),
		Query.limit(10),
		Query.select(['$id', 'name', 'max_capacity', 'price', 'discount_price'])
	]);

	return results.documents;
}
