import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { config } from '~/lib/utils/config';

import * as schema from './schema';

const client = createClient({ url: config.TURSO_DATABASE_URL, authToken: config.TURSO_DATABASE_TOKEN });

export const db = drizzle(client, { schema });
