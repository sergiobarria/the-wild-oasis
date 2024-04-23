import { getTursoClient } from './get-client';
import { cabins } from '../src/lib/db/schemas';

async function main() {
	try {
		const { db } = getTursoClient();

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
