import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import dotenv from 'dotenv'

dotenv.config()

const client = postgres(process.env.DATABASE_URL as string)

export const db = drizzle(client)

async function main() {
	try {
		console.log('⇨ Migrating database...')
		console.log('⇨ Database URL: ', process.env.DATABASE_URL)
		await migrate(db, { migrationsFolder: './migrations' }) // path relative to the root of the project
		console.log('⇨ ✅ Database migrated successfully...')
	} catch (error) {
		console.error('💥 ERROR: ', error)
		process.exit(1)
	} finally {
		process.exit()
	}
}

main()
