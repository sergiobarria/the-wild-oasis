'use server';

import { db } from '@/db';
import { cabins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

const DeleteCabinSchema = z.object({
	cabinId: z.string()
});

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
