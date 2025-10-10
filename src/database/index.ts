import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import { env } from '@/config/server-env'

import * as schema from './schemas'

const dev = env.NODE_ENV === 'development'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set')

const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle(client, { schema, logger: dev })
