import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
	schema: 'src/lib/db/schemas.ts',
	out: 'drizzle/migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL as string,
		authToken: process.env.TURSO_AUTH_TOKEN as string
	}
});
