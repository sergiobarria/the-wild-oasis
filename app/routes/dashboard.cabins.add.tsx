import { useId } from 'react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, redirect, useActionData, useNavigate, useNavigation } from '@remix-run/react';
import { ChevronLeftIcon, SaveIcon, Loader2Icon } from 'lucide-react';
import { parseWithZod } from '@conform-to/zod';
import { useForm, getFormProps, getInputProps, getTextareaProps } from '@conform-to/react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { CabinSchema } from '~/lib/schemas/cabin';
import { createCabin } from '~/lib/.services/cabins';
import { Textarea } from '~/components/ui/textarea';

export const meta: MetaFunction = () => {
	return [{ title: 'Create Cabin | The Wild Oasis' }];
};

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema: CabinSchema });

	if (submission.status !== 'success') {
		return json(submission.reply(), { status: 400 });
	}

	const cabin = await createCabin(submission.value);

	if (!cabin.id) {
		return json(
			submission.reply({
				formErrors: ['An error occurred while creating the cabin. Please try again.'],
			}),
			{ status: 500 }
		);
	}

	return redirect('/dashboard/cabins');
}

export default function CreateCabinPage() {
	const lastResult = useActionData<typeof action>();
	const navigation = useNavigation();
	const navigate = useNavigate();
	const isSubmitting = navigation.state !== 'idle';

	const [form, fields] = useForm({
		id: useId(),
		lastResult,
		shouldValidate: 'onBlur',
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: CabinSchema });
		},
		defaultValue: {
			discount_price: 0,
		},
	});

	return (
		<>
			<Button variant="outline" size="icon" className="mb-3" onClick={() => navigate('/dashboard/cabins')}>
				<ChevronLeftIcon size={24} />
			</Button>
			<h1 className="text-3xl font-bold">Create New Cabin</h1>

			<Form method="POST" className="mt-6 flex max-w-xl flex-col justify-start space-y-6" {...getFormProps(form)}>
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						{...getInputProps(fields.name, {
							type: 'text',
						})}
						placeholder='e.g. "The Wild Oasis"'
					/>
					{fields.name.errors && <small className="text-xs italic text-red-500">*{fields.name.errors}</small>}
				</div>

				<div>
					<Label htmlFor="max_capacity">Maximum Capacity</Label>
					<Input
						{...getInputProps(fields.max_capacity, {
							type: 'number',
						})}
						placeholder="10"
					/>
					{fields.max_capacity.errors && (
						<small className="text-xs italic text-red-500">*{fields.max_capacity.errors}</small>
					)}
				</div>

				<div className="flex flex-col items-center gap-8 lg:flex-row">
					<div className="w-full">
						<Label htmlFor="price">Regular Price (USD)</Label>
						<Input
							{...getInputProps(fields.price, {
								type: 'number',
							})}
							placeholder="100"
						/>
						{fields.price.errors && (
							<small className="text-xs italic text-red-500">*{fields.price.errors}</small>
						)}
					</div>
					<div className="w-full">
						<Label htmlFor="discount_price">Discount Price (USD)</Label>
						<Input
							{...getInputProps(fields.discount_price, {
								type: 'number',
							})}
							placeholder="80"
						/>
						{fields.discount_price.errors && (
							<small className="text-xs italic text-red-500">*{fields.discount_price.errors}</small>
						)}
					</div>
				</div>

				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						{...getTextareaProps(fields.description)}
						rows={5}
						placeholder="A brief description of the cabin and its amenities."
					/>
					{fields.description.errors && (
						<small className="text-xs italic text-red-500">*{fields.description.errors}</small>
					)}
				</div>

				<hr className="my-6 border-gray-300" />

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? (
						<Loader2Icon size={24} className="animate-spin" />
					) : (
						<>
							<SaveIcon size={20} className="mr-2" />
							Create
						</>
					)}
				</Button>
			</Form>
		</>
	);
}
