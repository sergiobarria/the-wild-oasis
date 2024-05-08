import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { CabinInputSchema } from '$lib/validators/cabin';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(CabinInputSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(CabinInputSchema));
		if (!form.valid) fail(400, { form });

		try {
			await event.locals.pb.collection('cabins').create({
				...form.data,
				price: form.data.price * 100,
				discount_price: form.data.discount_price * 100
			});
		} catch (err: unknown) {
			console.error('=> 💥 ERROR creating record: ', err);
			fail(500, { form });
		}

		redirect(
			'/cabins',
			{ type: 'success', message: 'Cabin created successfully!' },
			event.cookies
		);
	}
};
