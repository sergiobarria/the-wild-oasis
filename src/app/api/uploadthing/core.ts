import { createUploadthing, type FileRouter } from 'uploadthing/next';
// import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const fileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.middleware(async ({ req }) => {
			// Here we can run server logic to validate the user using the request
			// console.log('REQ: ', req);

			// if (!user) throw new UploadThingError('Unauthorized');

			// return {userId: '123'};
			return {};
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			// console.log('Upload complete for userId:', metadata.userId);

			// console.log('file url', file.url);

			return {};
		})
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
