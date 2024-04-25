import { Form, Link, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { db } from '~/lib/db/db.server';
import { InsertCabinSchema } from '~/lib/schemas/cabins-schemas';
import { redirectWithToast } from '~/lib/utils/toast.server';
import { cabins } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

export const meta: MetaFunction = () => {
	return [{ title: 'Edit Cabin | Hotel Booking System' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
	const cabinId = params.id;

	if (!cabinId) return redirect('/dashboard/cabins');

	const cabin = await db.query.cabins.findFirst({
		where: (cabins, { eq }) => eq(cabins.id, cabinId)
	});

	if (!cabin) return redirect('/dashboard/cabins');

	cabin.price = cabin.price / 100;
	cabin.discountPrice = cabin.discountPrice ? cabin.discountPrice / 100 : null;

	return json({ cabin });
}

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema: InsertCabinSchema });

	if (submission.status !== 'success') {
		return json(submission.reply(), { status: 400 });
	}

	try {
		const result = await db
			.update(cabins)
			.set({
				...submission.value,
				price: submission.value.price * 100,
				discountPrice: submission.value.discountPrice ? submission.value.discountPrice * 100 : null
			})
			.where(eq(cabins.id, params.id as string))
			.returning({ updatedId: cabins.id });

		if (!result?.at(0)?.updatedId) throw new Error('Failed to save the cabin');

		const toast = { title: 'Success!', description: 'Cabin updated successfully!' };
		return redirectWithToast('/dashboard/cabins/' + params.id, toast);
	} catch (err: unknown) {
		console.error('=> 💥 Something went wrong!', err);
		return json(
			submission.reply({
				formErrors: ['Failed to save the cabin. Please try again later.']
			}),
			{ status: 500 }
		);
	}
}

export default function EditCabinPage() {
	const { cabin } = useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state !== 'idle';

	const [form, fields] = useForm({
		id: 'edit-cabin-form',
		lastResult,
		shouldValidate: 'onBlur',
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: InsertCabinSchema });
		},
		defaultValue: {
			name: cabin.name,
			maxCapacity: cabin.maxCapacity,
			price: cabin.price,
			discountPrice: cabin.discountPrice,
			description: cabin.description
		}
	});

	return (
		<>
			<div className="flex items-center">
				<div>
					<Button variant="outline" size="icon" className="mb-3" asChild>
						<Link to="/dashboard/cabins">
							<ChevronLeftIcon size={20} />
						</Link>
					</Button>
					<h1 className="mb-3 text-3xl font-bold">Edit Cabin: {cabin.name}</h1>
				</div>
				<Button className="ml-auto" asChild>
					<Link to={'/dashboard/cabins'}>
						<span className="ml-2">Back To All Cabins</span>
					</Link>
				</Button>
			</div>

			{/* Edit Cabin Form */}
			<Form method="POST" className="max-w-lg space-y-3" {...getFormProps(form)}>
				<div>
					<Label htmlFor="name">*Cabin Name</Label>
					<Input {...getInputProps(fields.name, { type: 'text' })} placeholder="e.g. The Wild Oasis" />
					{fields.name.errors && <small className="text-destructive italic">*{fields.name.errors}</small>}
				</div>

				<div>
					<Label htmlFor="maxCapacity">*Max. Capacity</Label>
					<Input {...getInputProps(fields.maxCapacity, { type: 'number' })} placeholder="10" />
					{fields.maxCapacity.errors && (
						<small className="text-destructive italic">*{fields.maxCapacity.errors}</small>
					)}
				</div>

				<div className="flex flex-col gap-6 md:flex-row">
					<div className="w-full">
						<Label htmlFor="price">*Price</Label>
						<Input {...getInputProps(fields.price, { type: 'number' })} placeholder="99.99" />
						{fields.price.errors && (
							<small className="text-destructive italic">*{fields.price.errors}</small>
						)}
					</div>
					<div className="w-full">
						<Label htmlFor="discountPrice">Price Discount</Label>
						<Input {...getInputProps(fields.discountPrice, { type: 'number' })} placeholder="0.00" />
					</div>
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea {...getTextareaProps(fields.description)} rows={5} placeholder="Cabin description..." />
				</div>
				<div>
					{form.errors?.map((error) => (
						<small key={error} className="text-destructive italic">
							- {form.errors}
						</small>
					))}
				</div>

				<Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
					{isSubmitting ? <Loader2Icon size={16} className="animate-spin" /> : 'Update Cabin'}
				</Button>
			</Form>
		</>
	);
}
