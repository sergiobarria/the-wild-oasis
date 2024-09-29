import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

const { DATABASE_URL, DATABASE_TOKEN } = process.env;

if (!DATABASE_URL) {
	throw new Error('Database credentials must be provided');
}

export default defineConfig({
	schema: 'src/database/schemas',
	out: 'src/database/migrations',
	dialect: 'sqlite',
	driver: 'turso',
	dbCredentials: {
		url: DATABASE_URL,
		authToken: DATABASE_TOKEN,
	},
});
