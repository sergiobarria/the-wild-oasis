import { ActionFunctionArgs, MetaFunction, json } from '@remix-run/node';
import { Form, useActionData, useNavigate, useNavigation } from '@remix-run/react';
import { useForm, getInputProps, getTextareaProps, getFormProps } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';
import slugify from 'slugify';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { InsertCabinSchema } from '~/lib/schemas/cabins-schemas';
import { db } from '~/lib/db/db.server';
import { cabins } from '~/lib/db/schema';
import { redirectWithToast } from '~/lib/utils/toast.server';

export const meta: MetaFunction = () => {
	return [{ title: 'New Cabin | Hotel Booking System' }];
};

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema: InsertCabinSchema });

	if (submission.status !== 'success') {
		return json(submission.reply(), { status: 400 });
	}

	try {
		const result = await db.insert(cabins).values({
			...submission.value,
			price: submission.value.price * 100, // Convert price to cents
			discountPrice: submission.value.discountPrice ? submission.value.discountPrice * 100 : null, // Convert price to cents
			slug: slugify(submission.value.name)
		});

		if (result.rowsAffected === 0) throw new Error('Failed to save the cabin');

		const toast = { title: 'Success!', description: 'Cabin added successfully!' };

		return redirectWithToast('/dashboard/cabins', toast);
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

export default function AddNewCabinPage() {
	const lastResult = useActionData<typeof action>();
	const navigation = useNavigation();
	const navigate = useNavigate();
	const isSubmitting = navigation.state !== 'idle';

	const [form, fields] = useForm({
		id: 'add-cabin-form',
		lastResult,
		shouldValidate: 'onBlur',
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: InsertCabinSchema });
		}
	});

	return (
		<>
			<Button variant="outline" size="icon" className="mb-3" onClick={() => navigate('/dashboard/cabins')}>
				<ChevronLeftIcon size={20} />
			</Button>
			<h1 className="mb-3 text-3xl font-bold">Add New Cabin</h1>
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
				{form.errors?.map((error) => (
					<small key={error} className="text-destructive italic">
						- {form.errors}
					</small>
				))}

				<Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
					{isSubmitting ? <Loader2Icon size={16} className="animate-spin" /> : 'Add Cabin'}
				</Button>
			</Form>
		</>
	);
}
