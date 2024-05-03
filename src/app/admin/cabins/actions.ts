'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseWithZod } from '@conform-to/zod';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import slugify from 'slugify';

import { db } from '@/db';
import { cabins } from '@/db/schema';
import { InsertCabinSchema } from '@/schemas/cabin';

const DeleteCabinSchema = z.object({
	cabinId: z.string()
});

export async function createCabinAction(prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, { schema: InsertCabinSchema });
	if (submission.status !== 'success') return submission.reply();

	let cabinId: string | undefined;

	try {
		const result = await db
			.insert(cabins)
			.values({
				...submission.value,
				id: createId(),
				slug: slugify(submission.value.name, { lower: true })
			})
			.returning({ insertedId: cabins.id });

		cabinId = result?.at(0)?.insertedId;
		cookies().set('cabinCreated', 'true', { maxAge: 5 }); // 5 seconds
	} catch (error) {
		console.error('=> 💥 ERROR creating cabin', error);
		return submission.reply({
			formErrors: ['Error creating cabin']
		});
	}

	revalidateTag('cabins');
	redirect('/admin/cabins/' + cabinId);
}

export async function deleteCabinAction(formData: FormData) {
	try {
		const result = DeleteCabinSchema.safeParse({
			cabinId: formData.get('cabinId')
		});

		if (!result.success) {
			return {
				success: false,
				errors: result.error.errors.flatMap((error) => error.message)
			};
		}

		await db.delete(cabins).where(eq(cabins.id, result.data.cabinId));
	} catch (err: unknown) {
		console.error('=> 💥 ERROR deleting cabin', err);
		return { success: false, message: 'Error deleting cabin' };
	}

	revalidateTag('cabins');
	return { success: true, message: 'Cabin deleted successfully' };
}
