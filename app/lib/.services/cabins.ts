import { getXataClient } from '../xata';

const client = getXataClient();

export async function getCabins() {
	const cabins = await client.db.cabins.select(['id', 'name', 'price', 'discount_price', 'max_capacity']).getAll();

	return cabins;
}

export async function getCabinByID(cabinID: string) {
	const cabin = await client.db.cabins.read(cabinID);
	if (!cabin) return null;

	return cabin;
}

export async function deleteCabin(cabinID: string) {
	const record = await client.db.cabins.delete(cabinID);
	if (!record) return null;

	return record.id;
}
