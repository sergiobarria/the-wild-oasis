import { cabins } from '../src/db/schema';
import { getDBClient } from './get-client';

async function main() {
	try {
		const { db } = getDBClient();

		await db.delete(cabins);

		console.log('=> Deleting all cabins records...');
		console.log('=> ✅ Delete complete!');
	} catch (err: unknown) {
		console.error('=> ❌ Delete failed:', err);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

main();
