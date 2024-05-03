'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldDescription, FieldErrors, FormField } from '@/components/ui/form-helpers';
import { SubmitButton } from '@/components/ui/submit-button';
import { InsertCabinSchema } from '@/schemas/cabin';
import { createCabinAction } from './actions';

export function CabinForm() {
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

	return (
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

			<SubmitButton />
		</form>
	);
}
