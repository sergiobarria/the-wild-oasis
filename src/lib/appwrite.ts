import { Client, Account, Databases } from 'appwrite';

import { env } from '@/env';

const client = new Client();
client.setEndpoint(env.VITE_API_ENDPOINT).setProject(env.VITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
