import { S3Client } from '@aws-sdk/client-s3';

import { S3_URL_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME } from '$env/static/private';

export const s3 = new S3Client({
	region: 'auto',
	endpoint: S3_URL_ENDPOINT as string,
	credentials: {
		accessKeyId: S3_ACCESS_KEY as string,
		secretAccessKey: S3_SECRET_KEY as string
	}
});

export const BUCKET_NAME = S3_BUCKET_NAME as string;
