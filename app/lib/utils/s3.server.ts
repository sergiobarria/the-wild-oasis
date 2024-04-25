import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config.server';

/**
 * Get the S3 client for Cloudflare R2
 */
export function getS3Client() {
	return new S3Client({
		region: 'auto',
		endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: config.R2_ACCESS_KEY_ID,
			secretAccessKey: config.R2_SECRET_ACCESS_KEY
		}
	});
}
