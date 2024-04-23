import { migrate } from 'drizzle-orm/libsql/migrator';

import { getTursoClient } from './get-client';

async function main() {
	try {
		const { db, url } = getTursoClient();

		console.log('=> Migrating database...');
		console.log('=> Database URL: ', url);
		await migrate(db, { migrationsFolder: 'drizzle/migrations' });

		console.log('=> ✅ Migrations complete!');
	} catch (err: unknown) {
		console.error('=> ❌ Migration failed:', err);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

main();
