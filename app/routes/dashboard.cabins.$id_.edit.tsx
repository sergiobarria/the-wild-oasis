import { useState } from 'react';
import { Form, Link, useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ChevronLeftIcon, Loader2Icon, XIcon } from 'lucide-react';
import { eq } from 'drizzle-orm';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { db } from '~/lib/db/db.server';
import { InsertCabinSchema } from '~/lib/schemas/cabins-schemas';
import { redirectWithToast } from '~/lib/utils/toast.server';
import { cabins } from '~/lib/db/schema';
import { config } from '~/lib/utils/config.server';

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
	cabin.image = cabin.image ? `${config.R2_BUCKET_BASE_URL}/${cabin.image}` : 'https://placehold.co/150x100';

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
	const [deleting, setDeleting] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [imageKey, setImageKey] = useState<string>('');
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

	async function handleDeleteFile() {
		setDeleting(true);
		const objectKey = cabin.image?.split('/').pop();
		console.log('DELETING FILE WITH OBJECT KEY: ', objectKey);

		try {
			const response = await fetch('/resources/files/delete', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ objectKey, recordId: cabin.id })
			});

			if (!response.ok) throw new Error('Failed to delete the file.');

			const data = (await response.json()) as { success: boolean; message: string };

			if (!data.success) throw new Error(data.message);

			// Update the cabin image in the UI
			setImageKey('');
		} catch (err: unknown) {
			console.error('=> 💥 Error deleting object from S3.', err);
		} finally {
			setDeleting(false);
		}
	}

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
			<div className="flex gap-8">
				<Form method="POST" className="max-w-lg flex-1 space-y-3" {...getFormProps(form)}>
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
						{isSubmitting ? <Loader2Icon size={16} className="animate-spin" /> : 'Update Cabin'}
					</Button>
				</Form>

				<div className="relative h-96 w-full max-w-[500px] rounded-lg bg-gray-300">
					<img
						src={previewImage || cabin.image || 'https://placehold.co/500x400'}
						alt="Cabin Preview"
						className="h-96 w-full rounded-lg bg-gray-100 object-cover object-center"
					/>
					{cabin.image && (
						<Button
							variant="outline"
							size="icon"
							className="absolute right-3 top-3 rounded-full bg-destructive text-destructive-foreground"
							onClick={handleDeleteFile}
						>
							{deleting ? <Loader2Icon size={20} className="animate-spin" /> : <XIcon size={20} />}
						</Button>
					)}
				</div>
			</div>
		</>
	);
}
