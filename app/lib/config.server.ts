import { cleanEnv, str } from 'envalid';

export const env = cleanEnv(process.env, {
	XATA_BRANCH: str(),
	XATA_API_KEY: str(),
});
