import { cleanEnv, str } from 'envalid';

export const config = cleanEnv(process.env, {
	TURSO_DATABASE_URL: str(),
	TURSO_DATABASE_TOKEN: str()
});
