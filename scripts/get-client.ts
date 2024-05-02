import { drizzle } from 'drizzle-orm/postgres-js';
import * as dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

export function getDBClient() {
	const PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING as string;

	if (!PG_CONNECTION_STRING) {
		throw new Error('Missing PG_CONNECTION_STRING');
	}

	const client = postgres(PG_CONNECTION_STRING, { max: 1 }); // Only one connection for migrations
	const db = drizzle(client);

	return { db, uri: PG_CONNECTION_STRING };
}
