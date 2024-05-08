import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: 'src/db/schema.ts',
	out: 'drizzle/migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL as string,
		authToken: process.env.TURSO_DATABASE_TOKEN as string
	}
});
