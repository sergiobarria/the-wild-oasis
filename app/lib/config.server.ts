import { cleanEnv, str } from 'envalid';

export const env = cleanEnv(process.env, {
	DB_URL: str(),
	DB_AUTH_TOKEN: str(),
});
