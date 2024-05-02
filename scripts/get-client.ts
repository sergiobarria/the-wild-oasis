import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export function getDBClient() {
	const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL as string;
	const TURSO_DATABASE_TOKEN = process.env.TURSO_DATABASE_TOKEN as string;

	if (!TURSO_DATABASE_URL || !TURSO_DATABASE_TOKEN) {
		throw new Error('Missing Credentials');
	}

	const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_DATABASE_TOKEN });
	const db = drizzle(client);

	return { db, uri: TURSO_DATABASE_URL };
}
