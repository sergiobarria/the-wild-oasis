import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~/lib/db/db.server';
import { cabins } from '~/lib/db/schema';
import { config } from '~/lib/utils/config.server';
import { getS3Client } from '~/lib/utils/s3.server';

const RequestBodySchema = z.object({
	objectKey: z.string(),
	recordId: z.string()
});

export async function action({ request }: ActionFunctionArgs) {
	const body = (await request.json()) as { objectKey: string | undefined; recordId: string | undefined };

	const result = RequestBodySchema.safeParse(body);
	if (!result.success) {
		console.error('=> 💥 Missing required parameters.', result.error);
		return json({ success: false, message: 'Missing required parameters.' }, { status: 400 });
	}

	const s3 = getS3Client();

	try {
		await s3.send(
			new DeleteObjectCommand({
				Bucket: config.R2_BUCKET_NAME,
				Key: body.objectKey
			})
		);

		// If the object was deleted successfully, update the corresponding database record by deleting the objectKey (image)
		const result = await db.update(cabins).set({ image: null }).where(eq(cabins.id, body.recordId!));
		if (result.rowsAffected === 0) throw new Error('No records were updated.');

		return json({ success: true, message: 'Object deleted successfully.' }, { status: 200 });
	} catch (err: unknown) {
		console.error('=> 💥 Error deleting object from S3.', err);
		return json({ success: false, message: 'Error deleting object from S3.' }, { status: 500 });
	}
}
