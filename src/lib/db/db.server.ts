import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { TURSO_DATABASE_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';

import * as schema from './schemas';

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_DATABASE_TOKEN });

export const db = drizzle(client, { schema });
