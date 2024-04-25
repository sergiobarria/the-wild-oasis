import { cleanEnv, str } from 'envalid';

export const config = cleanEnv(process.env, {
	NODE_ENV: str({ default: 'development' }),
	SESSION_SECRET: str(),
	TURSO_DATABASE_URL: str(),
	TURSO_DATABASE_TOKEN: str(),
	R2_ACCOUNT_ID: str(),
	R2_TOKEN: str(),
	R2_ACCESS_KEY_ID: str(),
	R2_SECRET_ACCESS_KEY: str(),
	R2_BUCKET_NAME: str(),
	R2_BUCKET_BASE_URL: str()
});
