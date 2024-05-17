import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Doc } from '~/_generated/dataModel'
import { api } from '~/_generated/api'

const formSchema = z.object({
	minBookingDays: z.coerce.number().min(1).max(90),
	maxBookingDays: z.coerce.number().min(1).max(90),
	maxGuestsPerCabin: z.coerce.number().min(1).max(30),
	breakfastPrice: z.coerce.number().positive(),
})

interface SettingsPageProps {
	settings: Doc<'settings'>
}

export function SettingsForm({ settings }: SettingsPageProps) {
	const updateSettingsMutation = useMutation(api.settings.update)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			...(settings ?? {
				minBookingDays: 1,
				maxBookingDays: 90,
				maxGuestsPerCabin: 1,
				breakfastPrice: 15,
			}),
		},
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		const payload = {
			...data,
			breakfastPrice: data.breakfastPrice * 100,
		}

		try {
			await updateSettingsMutation({ id: settings._id, data: payload })
			toast.success('Settings updated')
		} catch (err: unknown) {
			console.error('=> Error updating settings:', err)
			toast.error('Error updating settings')
		}
	}

	return (
		<div className="mt-6 bg-white p-6">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6 ">
					<FormField
						control={form.control}
						name="minBookingDays"
						render={({ field }) => (
							<FormItem>
								<FormLabel>*Minimum nights/booking</FormLabel>
								<FormControl>
									<Input placeholder="3" {...field} />
								</FormControl>
								<FormDescription>
									Enter the minimum number of nights required for a booking.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="maxBookingDays"
						render={({ field }) => (
							<FormItem>
								<FormLabel>*Maximum nights/booking</FormLabel>
								<FormControl>
									<Input placeholder="90" {...field} />
								</FormControl>
								<FormDescription>
									Enter the maximum number of nights required for a booking.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="maxGuestsPerCabin"
						render={({ field }) => (
							<FormItem>
								<FormLabel>*Maximum guests/booking</FormLabel>
								<FormControl>
									<Input placeholder="12" {...field} />
								</FormControl>
								<FormDescription>
									Enter the maximum number of guests allowed in a booking.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="breakfastPrice"
						render={({ field }) => (
							<FormItem>
								<FormLabel>*Breakfast price</FormLabel>
								<FormControl>
									<Input placeholder="15" {...field} />
								</FormControl>
								<FormDescription>
									Enter the price of the breakfast per person.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">
						{form.formState.isSubmitting ? (
							<>
								<Loader2Icon className="h-6 w-6 animate-spin" />
								<span className="ml-2">Updating...</span>
							</>
						) : (
							'Update'
						)}
					</Button>
				</form>
			</Form>
		</div>
	)
}
