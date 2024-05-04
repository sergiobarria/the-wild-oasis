import { createRouteHandler } from 'uploadthing/next';

import { fileRouter } from './core';
import { z } from 'zod';
import { UTApi } from 'uploadthing/server';

const DeleteRequestBodySchema = z.object({
	fileUrl: z.string().url()
});

export const { GET, POST } = createRouteHandler({
	router: fileRouter,
	config: {}
});

export async function DELETE(req: Request) {
	const body = await req.json();
	const result = DeleteRequestBodySchema.safeParse(body);

	if (!result.success) {
		return Response.json({ success: false, error: result.error });
	}

	try {
		const utapi = new UTApi();
		const objectKey = result.data.fileUrl.split('/').pop() as string; // get the last part of the url

		const updateResponse = await utapi.deleteFiles([objectKey]);

		if (!updateResponse.success) throw new Error('Failed to delete file');

		return Response.json({ success: true });
	} catch (err: unknown) {
		console.error('=> DELETE /api/uploadthing', err);
		return Response.json({ success: false, error: 'Failed to delete file' });
	}
}
