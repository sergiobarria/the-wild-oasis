import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	schema: './app/lib/schemas.server.ts',
	out: './drizzle/migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.DB_URL as string,
		authToken: process.env.DB_AUTH_TOKEN as string,
	},
});
