import { BUCKET_NAME, s3 } from '$lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json, type RequestHandler } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import * as v from 'valibot';

const UploadSchema = v.object({
	filename: v.string('filename is required'),
	contentType: v.string('contentType is required'),
	resourceType: v.string('resourceType is required'),
	resourceId: v.string('resourceId is required')
});

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const result = v.safeParse(UploadSchema, body);

	if (!result.success)
		return json({ errors: result.issues.map((issue) => issue.message) }, { status: 400 });

	const { resourceType, resourceId, filename, contentType } = result.output;
	const key = `${resourceType}/${resourceId}/${nanoid()}-${filename}`;

	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: key,
		ContentType: contentType
	});

	const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

	return json({ uploadUrl, key }, { status: 200 });
};
