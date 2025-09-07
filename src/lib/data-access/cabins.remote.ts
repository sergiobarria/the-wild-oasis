import * as v from 'valibot';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { cabins } from '$lib/server/db/schema/cabin';
import { CreateCabinSchema } from '$lib/validators/cabins-validators';
import { formDataToObject, getMediaUrl } from '$lib/utils';
import { BUCKET_NAME, s3 } from '$lib/s3';
import { media } from '$lib/server/db/schema/media';

export const getCabins = query(async () => {
	const cabins = await db.query.cabins.findMany({
		where: (cabins, { eq }) => eq(cabins.isActive, true),
		columns: {
			createdAt: false,
			updatedAt: false,
			description: false
		},
		orderBy: (cabins, { desc }) => [desc(cabins.createdAt), desc(cabins.name)]
	});

	const cabinsWithMedia = await Promise.all(
		cabins.map(async (cabin) => {
			const images = await db.query.media.findMany({
				where: (media, { eq }) => eq(media.resourceId, cabin.id)
			});

			return {
				...cabin,
				images: images.map((image) => getMediaUrl(image.key))
			};
		})
	);

	return cabinsWithMedia;
});

type CreateCabinResult = {
	success: boolean;
	cabinId?: string;
	errors?: any;
};

export const createCabin = form(async (data): Promise<CreateCabinResult> => {
	const dataObj = formDataToObject(data);
	const result = v.safeParse(CreateCabinSchema, dataObj);

	if (!result.success) {
		const errors = v.flatten<typeof CreateCabinSchema>(result.issues);
		console.error('Create Cabin validation failed: ', errors);
		return { success: false, errors };
	}

	return await db.transaction(async (tx) => {
		try {
			const [newCabin] = await tx
				.insert(cabins)
				.values({
					...result.output,
					slug: slugify(result.output.name, { lower: true }),
					price: result.output.price * 100,
					isActive: true
				})
				.returning({ id: cabins.id });

			// Upload images if any
			if (result.output.images && result.output.images.length > 0) {
				const imagePromises = result.output.images.map(async (file) => {
					const key = `cabins/${newCabin.id}/${nanoid()}-${file.name}`;

					const command = new PutObjectCommand({
						Bucket: BUCKET_NAME,
						Key: key,
						Body: Buffer.from(await file.arrayBuffer()),
						ContentType: file.type
					});

					await s3.send(command);

					return tx.insert(media).values({
						key,
						filename: file.name,
						contentType: file.type,
						resourceType: 'cabin',
						resourceId: newCabin.id
					});
				});

				await Promise.all(imagePromises);
			}

			return { success: true, cabinId: newCabin.id };
		} catch (err: unknown) {
			console.error('Transaction failed:', err);
			// ✨ Retornar errores de manera consistente
			return {
				success: false,
				errors: {
					root: ['Failed to create cabin. Please try again.']
				}
			};
		}
	});
});

export const deleteCabin = command(v.string(), async (id) => {
	const result = await db.delete(cabins).where(eq(cabins.id, id));

	if (result.rowsAffected === 0) throw new Error('Cabin not found or could not be deleted');
});
