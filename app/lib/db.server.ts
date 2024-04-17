import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { env } from './config.server';

const url = env.DB_URL;
const authToken = env.DB_AUTH_TOKEN;

const client = createClient({ url, authToken });

export const db = drizzle(client);
