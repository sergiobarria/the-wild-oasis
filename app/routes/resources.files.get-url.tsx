import { ActionFunctionArgs, json } from '@remix-run/node';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { getS3Client } from '~/lib/utils/s3.server';
import { config } from '~/lib/utils/config.server';

const RequestBodySchema = z.object({
	fileName: z.string(),
	fileType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'])
});

export async function action({ request }: ActionFunctionArgs) {
	const body = (await request.json()) as {
		fileName: string | undefined;
		fileType: string | undefined;
	};

	const result = RequestBodySchema.safeParse(body);

	if (!result.success) {
		console.error('=> 💥 Missing required parameters.', result.error);
		return json({ message: 'Missing required parameters.' }, { status: 400 });
	}

	const fileName = body.fileName?.split('.').slice(0, -1).join('.');
	const objectKey = `${fileName}_${createId()}`;
	const s3 = getS3Client();

	const presignedUrl = await getSignedUrl(
		s3,
		new PutObjectCommand({
			Bucket: config.R2_BUCKET_NAME,
			Key: objectKey,
			ContentType: body.fileType,
			ACL: 'public-read'
		}),
		{
			expiresIn: 60 * 5 // 5 minutes
		}
	);

	return json({ presignedUrl, objectKey });
}
