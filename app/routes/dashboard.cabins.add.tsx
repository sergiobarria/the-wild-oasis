import { useState } from 'react';
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
import { createId } from '@paralleldrive/cuid2';

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
			id: createId(), // Use cuid's as primary key instead of auto-incrementing integers
			price: submission.value.price * 100, // Convert price to cents
			discountPrice: submission.value.discountPrice ? submission.value.discountPrice * 100 : null, // Convert price to cents
			slug: slugify(submission.value.name, { lower: true }),
			image: submission.value.image
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
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [imageKey, setImageKey] = useState<string>('');
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

	async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		try {
			const fileReader = new FileReader();
			fileReader.onloadend = () => {
				setPreviewImage(fileReader.result as string);
			};
			fileReader.readAsDataURL(file);

			// Get a presigned URL for the file
			const response = await fetch('/resources/files/get-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileName: file.name,
					fileType: file.type
				})
			});
			const data = (await response.json()) as { presignedUrl: string; objectKey: string };

			// Upload the file to the presigned URL using a PUT request
			const uploadResponse = await fetch(data.presignedUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type },
				body: file
			});

			if (!uploadResponse.ok) throw new Error('Failed to upload the file');

			// Save the object key to the state
			setImageKey(data.objectKey);
		} catch (err: unknown) {
			console.error('=> 💥 Something went wrong!', err);
		}
	}

	return (
		<>
			<Button variant="outline" size="icon" className="mb-3" onClick={() => navigate('/dashboard/cabins')}>
				<ChevronLeftIcon size={20} />
			</Button>
			<h1 className="mb-3 text-3xl font-bold">Add New Cabin</h1>

			<div className="flex gap-8">
				<Form
					method="POST"
					className="max-w-lg flex-1 space-y-3"
					{...getFormProps(form)}
					encType="multipart/form-data"
				>
					<div>
						<Label htmlFor="name">*Cabin Name</Label>
						<Input {...getInputProps(fields.name, { type: 'text' })} placeholder="e.g. The Wild Oasis" />
						{fields.name.errors && <small className="italic text-destructive">*{fields.name.errors}</small>}
					</div>

					<div>
						<Label htmlFor="maxCapacity">*Max. Capacity</Label>
						<Input {...getInputProps(fields.maxCapacity, { type: 'number' })} placeholder="10" />
						{fields.maxCapacity.errors && (
							<small className="italic text-destructive">*{fields.maxCapacity.errors}</small>
						)}
					</div>

					<div className="flex flex-col gap-6 md:flex-row">
						<div className="w-full">
							<Label htmlFor="price">*Price</Label>
							<Input {...getInputProps(fields.price, { type: 'number' })} placeholder="99.99" />
							{fields.price.errors && (
								<small className="italic text-destructive">*{fields.price.errors}</small>
							)}
						</div>
						<div className="w-full">
							<Label htmlFor="discountPrice">Price Discount</Label>
							<Input {...getInputProps(fields.discountPrice, { type: 'number' })} placeholder="0.00" />
						</div>
					</div>

					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							{...getTextareaProps(fields.description)}
							rows={5}
							placeholder="Cabin description..."
						/>
					</div>

					<div>
						<Label htmlFor="image">Cabin Image</Label>
						<Input id="image" type="file" onChange={handleFileUpload} className="cursor-pointer" />
					</div>

					{/* Image key hidden input */}
					<input type="hidden" name="image" value={imageKey} />

					<div>
						{form.errors?.map((error) => (
							<small key={error} className="italic text-destructive">
								- {form.errors}
							</small>
						))}
					</div>

					<Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
						{isSubmitting ? <Loader2Icon size={16} className="animate-spin" /> : 'Add Cabin'}
					</Button>
				</Form>

				<div className="h-auto max-w-[500px]">
					<img
						src={previewImage ?? 'https://placehold.co/500x400'}
						alt="Cabin Preview"
						className="h-96 w-full rounded-lg object-cover"
					/>
				</div>
			</div>
		</>
	);
}
