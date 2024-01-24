import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
	schema: './src/lib/database/schemas.ts',
	out: './migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL as string
	},
	verbose: true,
	strict: true
})
