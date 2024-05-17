import { useMutation } from 'convex/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '~/_generated/api'
import { Doc, Id } from '~/_generated/dataModel'
import { ImageUpload } from '../ui/image-upload'

const formSchema = z.object({
	name: z
		.string({
			required_error: 'Name is required',
		})
		.min(3)
		.max(50),
	maxCapacity: z.coerce.number().int().min(1).max(30),
	price: z.coerce.number(),
	discount: z.coerce.number(),
	description: z.string(),
	image: z.any().optional(), // TODO: Find a way to validate that the image is of type Id<'_storage'>
})

interface CabinsFormProps {
	onSubmitComplete: () => void
	cabin?: Doc<'cabins'> & { imageUrl: string }
}

export function CabinsForm({ onSubmitComplete, cabin }: CabinsFormProps) {
	const createCabinMutation = useMutation(api.cabins.create)
	const updateCabinMutation = useMutation(api.cabins.update)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...(cabin || {
				name: '',
				maxCapacity: 0,
				price: 0,
				discount: 0,
				description: '',
			}),
		},
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		const payload = {
			...data,
			price: data.price * 100,
			discount: data.discount * 100,
		}

		try {
			if (cabin) {
				await updateCabinMutation({
					id: cabin._id,
					data: payload,
				})
				toast.success('Cabin updated successfully.')
			} else {
				await createCabinMutation(payload)
				toast.success('Cabin created successfully.')
			}

			onSubmitComplete()
		} catch (err: unknown) {
			console.error('=> 💥 Error creating cabin: ', err)
			toast.error('Failed to create cabin. Please try again.')
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1 pb-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>*Cabin Name</FormLabel>
							<FormControl>
								<Input placeholder="001" {...field} />
							</FormControl>
							<FormDescription>
								Enter the name of the cabin. This will be displayed in the
								application.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="maxCapacity"
					render={({ field }) => (
						<FormItem>
							<FormLabel>*Maximum Capacity</FormLabel>
							<FormControl>
								<Input placeholder="10" {...field} />
							</FormControl>
							<FormDescription>
								Enter the maximum number of people that can stay in this cabin.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex items-center gap-6">
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>*Regular Price</FormLabel>
								<FormControl>
									<Input placeholder="1249.99" {...field} />
								</FormControl>
								<FormDescription>
									Enter the regular price of the cabin.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="discount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>*Discount</FormLabel>
								<FormControl>
									<Input placeholder="199.99" {...field} />
								</FormControl>
								<FormDescription>
									Enter the discount amount for the cabin.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>*Cabin Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="This is a beautiful cabin..."
									{...field}
									rows={5}
								/>
							</FormControl>
							<FormDescription>
								Enter the description of the cabin. This will be displayed in the
								application.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<ImageUpload
					storageId={form.getValues('image')}
					imageUrl={cabin?.imageUrl}
					onImageUpload={(storageId: Id<'_storage'>) => form.setValue('image', storageId)}
					onDeleteImage={() => form.setValue('image', null)}
				/>

				<Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
					{form.formState.isSubmitting && (
						<Loader2Icon className="mr-2 size-4 animate-spin" />
					)}
					{cabin ? 'Update Cabin' : 'Create Cabin'}
				</Button>
			</form>
		</Form>
	)
}
