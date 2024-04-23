import { cleanEnv, str } from 'envalid';

export const config = cleanEnv(process.env, {
	NODE_ENV: str({ default: 'development' }),
	SESSION_SECRET: str(),
	TURSO_DATABASE_URL: str(),
	TURSO_DATABASE_TOKEN: str()
});
