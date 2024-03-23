import { migrate } from 'drizzle-orm/libsql/migrator'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'

dotenv.config()

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL as string
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN as string

async function main() {
	try {
		const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN })
		const db = drizzle(client)

		console.log('⇨ Migrating database...')
		console.log('⇨ Database URL: ', TURSO_DATABASE_URL)
		await migrate(db, { migrationsFolder: 'drizzle/migrations' }) // path relative to the root of the project
		console.log('⇨ ✅ Database migrated successfully...')
	} catch (error) {
		console.error('💥 ERROR: ', error)
		process.exit(1)
	} finally {
		process.exit()
	}
}

main()
