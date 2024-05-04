import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { env } from '@/env';
import * as schema from './schema';

export const client = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_DATABASE_TOKEN });

export const db = drizzle(client, { schema });
