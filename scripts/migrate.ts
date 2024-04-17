import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const TURSO_DB_URL = process.env.DB_URL as string;
const TURSO_DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN as string;

async function main() {
	try {
		const client = createClient({ url: TURSO_DB_URL, authToken: TURSO_DB_AUTH_TOKEN });
		const db = drizzle(client);

		console.log('🚀 Migrating database...');
		console.log('🔧 Using database URL: ', TURSO_DB_URL);

		await migrate(db, { migrationsFolder: 'drizzle/migrations' }); // path relative to the root of the project

		console.log('🎉 Database migrated successfully!');
	} catch (error: unknown) {
		console.error('💥 ERROR: ', error);
		process.exit(1);
	}
}

void main();
