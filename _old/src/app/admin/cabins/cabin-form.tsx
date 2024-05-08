'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import Image from 'next/image';
import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldDescription, FieldErrors, FormField } from '@/components/ui/form-helpers';
import { SubmitButton } from '@/components/ui/submit-button';
import { UploadDropzone } from '@/lib/uploadthing';
import { Cabin, CabinSchema, InsertCabinSchema } from '@/schemas/cabin';
import { createCabinAction, updateCabinAction } from './_actions';
import { Button } from '@/components/ui/button';
import { Loader2Icon, XIcon } from 'lucide-react';

type CabinFormProps = {
	cabin?: Cabin;
};

export function CabinForm({ cabin }: CabinFormProps) {
	const [image, setImage] = useState<string>('');
	const [deleting, setDeleting] = useState<boolean>(false);
	const [lastResultCreate, createAction] = useFormState(createCabinAction, undefined);
	const [lastResultUpdate, updateAction] = useFormState(updateCabinAction, undefined);

	const [form, fields] = useForm({
		lastResult: cabin?.id ? lastResultUpdate : lastResultCreate,
		onValidate: ({ formData }) => {
			if (cabin?.id) return parseWithZod(formData, { schema: CabinSchema });

			return parseWithZod(formData, { schema: InsertCabinSchema });
		},
		shouldValidate: 'onBlur',
		defaultValue: {
			...(cabin || {})
		}
	});

	useEffect(() => {
		if (lastResultCreate?.status === 'error') {
			toast.error('There was an error creating the cabin. Please try again.');
		}
	}, [lastResultCreate]);

	async function handleDeleteFile() {
		if (!image) return;
		setDeleting(true);

		try {
			const res = await fetch('/api/uploadthing', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ fileUrl: image })
			});

			if (!res.ok) throw new Error('Failed to delete file');
			toast.success('File deleted');
			setImage('');
		} catch (err: unknown) {
			console.error('🚀 ~ handleDeleteFile ~ err:', err);
			toast.error('Failed to delete file');
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="py10 flex gap-8">
			<form
				{...getFormProps(form)}
				onSubmit={form.onSubmit}
				action={cabin?.id ? updateAction : createAction}
				className="w-full max-w-xl"
			>
				{/* Add Hidden fields if form is in edit mode */}
				{cabin?.id && <input hidden {...getInputProps(fields.id, { type: 'text' })} />}
				{cabin?.id && <input hidden {...getInputProps(fields.slug, { type: 'text' })} />}
				{cabin?.id && <input hidden {...getInputProps(fields.createdAt, { type: 'text' })} />}
				{cabin?.id && <input hidden {...getInputProps(fields.updatedAt, { type: 'text' })} />}

				<FormField>
					<Label htmlFor="name">*Cabin Name</Label>
					<Input {...getInputProps(fields.name, { type: 'text' })} placeholder="The Wild Oasis" />
					<FieldDescription>Enter the name of the cabin, e.g. &quot;The Wild Oasis&quot;</FieldDescription>
					<FieldErrors errors={fields.name.errors} />
				</FormField>

				<FormField>
					<Label htmlFor="maxCapacity">*Max Capacity</Label>
					<Input {...getInputProps(fields.maxCapacity, { type: 'number' })} placeholder="10" />
					<FieldDescription>Enter the maximum number of people that can stay in the cabin</FieldDescription>
					<FieldErrors errors={fields.maxCapacity.errors} />
				</FormField>

				<FormField>
					<Label htmlFor="price">*Regular Price</Label>
					<Input {...getInputProps(fields.price, { type: 'number' })} placeholder="99.99" />
					<FieldDescription>Enter the price of the cabin per night, e.g. &quot;99.99&quot;</FieldDescription>
					<FieldErrors errors={fields.price.errors} />
				</FormField>

				<FormField>
					<Label htmlFor="discountPrice">Discount Price</Label>
					<Input {...getInputProps(fields.discountPrice, { type: 'number' })} placeholder="99.99" />
					<FieldDescription>
						Enter the discounted price of the cabin per night, e.g. &quot;99.99&quot;
					</FieldDescription>
					<FieldErrors errors={fields.discountPrice.errors} />
				</FormField>

				<FormField>
					<Label htmlFor="description">*Cabin Description</Label>
					<Textarea
						{...getTextareaProps(fields.description)}
						placeholder="This is a beautiful cabin with a lake view..."
						rows={5}
					/>
					<FieldDescription>Enter the description of the cabin</FieldDescription>
					<FieldErrors errors={fields.description.errors} />
				</FormField>

				<input hidden {...getInputProps(fields.cover, { type: 'text' })} defaultValue={cabin?.cover || image} />

				<div className="mt-4">
					<SubmitButton mode={cabin?.id ? 'update' : 'create'} />
				</div>
			</form>

			<div className="w-full">
				{cabin?.cover || image ? (
					<div className="relative h-[275px] overflow-hidden rounded-lg bg-gray-100 p-4">
						<Image
							src={cabin?.cover ? cabin.cover : image}
							alt="Cabin cover"
							className="h-auto max-h-[300px] w-full object-cover"
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
							priority
						/>
						<Button
							variant="outline"
							size="icon"
							onClick={handleDeleteFile}
							className="absolute right-4 top-4 rounded-full bg-destructive text-destructive-foreground"
						>
							{deleting ? <Loader2Icon className="size-4 animate-spin" /> : <XIcon className="size-4" />}
						</Button>
					</div>
				) : (
					<UploadDropzone
						endpoint="imageUploader"
						onClientUploadComplete={(res) => {
							console.log('🚀 ~ <UploadDropzoneendpoint ~ res:', res);
							setImage(res.at(0)?.url || '');
						}}
						onUploadError={(err: Error) => {
							console.error('🚀 ~ <UploadDropzoneendpoint ~ err:', err);
						}}
					/>
				)}
			</div>

			{form?.errors && form?.errors?.length > 0 && (
				<div className="mt-4 w-full">
					<h2 className="text-lg font-semibold text-red-600">Form Errors</h2>
					<pre>{JSON.stringify(form.errors, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
