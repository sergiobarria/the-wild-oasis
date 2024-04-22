import { InsertCabin } from '../schemas/cabin';
import { getXataClient } from '../xata';

const client = getXataClient();

export async function getCabins() {
	const cabins = await client.db.cabins
		.select(['id', 'name', 'price', 'discount_price', 'max_capacity'])
		.sort('xata.createdAt', 'desc')
		.getAll();

	return cabins;
}

export async function createCabin(data: InsertCabin) {
	const result = await client.db.cabins.create(data);

	return result;
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
