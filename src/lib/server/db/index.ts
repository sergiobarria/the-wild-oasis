import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import * as amenities from './schemas/amenities';
import * as bookings from './schemas/bookings';
import * as cabins from './schemas/cabins';
import * as reviews from './schemas/reviews';
import * as users from './schemas/users';

const schema = {
	...amenities,
	...bookings,
	...cabins,
	...reviews,
	...users
};

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!dev && !env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
