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
import { InsertCabinSchema } from '@/schemas/cabin';
import { createCabinAction } from './_actions';
import { Button } from '@/components/ui/button';
import { Loader2Icon, XIcon } from 'lucide-react';

export function CabinForm() {
	const [image, setImage] = useState<string>('');
	const [deleting, setDeleting] = useState<boolean>(false);
	const [lastResult, formAction] = useFormState(createCabinAction, undefined);

	const [form, fields] = useForm({
		lastResult,
		onValidate: ({ formData }) => {
			return parseWithZod(formData, { schema: InsertCabinSchema });
		},
		shouldValidate: 'onBlur'
	});

	useEffect(() => {
		if (lastResult?.status === 'error') {
			toast.error('There was an error creating the cabin. Please try again.');
		}
	}, [lastResult]);

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
			<form {...getFormProps(form)} onSubmit={form.onSubmit} action={formAction} className="w-full max-w-xl">
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
					/>
					<FieldDescription>Enter the description of the cabin</FieldDescription>
					<FieldErrors errors={fields.description.errors} />
				</FormField>

				<input hidden {...getInputProps(fields.cover, { type: 'text' })} value={image} readOnly />

				<div className="mt-4">
					<SubmitButton />
				</div>
			</form>

			<div className="w-full">
				{image ? (
					<div className="relative h-[275px] overflow-hidden rounded-lg bg-gray-100 p-4">
						<Image
							src={image}
							alt="Cabin cover"
							className="h-auto max-h-[300px] w-full object-cover"
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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
		</div>
	);
}
