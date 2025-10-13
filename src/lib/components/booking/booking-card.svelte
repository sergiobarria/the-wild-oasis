<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CalendarDate, DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import { CalendarIcon } from '@lucide/svelte';
	import type { DateRange } from 'bits-ui';
	import { format } from 'date-fns';

	import { goto } from '$app/navigation';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Item } from '$lib/components/ui/item';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import RangeCalendar from '$lib/components/ui/range-calendar/range-calendar.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { bookingConfig } from '$lib/config/booking';
	import type { Cabin } from '$lib/server/db/schemas';
	import { BookingPrice } from '$lib/services/booking-price.svelte';
	import { cn } from '$lib/utils';

	import { Label } from '../ui/label';

	interface BookingCardProps {
		cabin: Cabin;
	}

	let { cabin }: BookingCardProps = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let selectedDateRange: DateRange = $state({
		start: today(getLocalTimeZone()),
		end: today(getLocalTimeZone()).add({ days: 5 })
	});

	const bookingPrice = new BookingPrice(
		{
			pricePerNight: cabin.pricePerNight,
			discountPercentage: cabin.discountPercentage,
			maxGuests: cabin.maxGuests
		},
		bookingConfig
	);

	$effect(() => {
		bookingPrice.dateRange = selectedDateRange;
	});
	bookingPrice.guests = 1;

	const minCalendarDate = today(getLocalTimeZone());
	const maxCalendarDate = today(getLocalTimeZone()).add({ years: 1 });

	// NOTE: Mock booked dates -> REMOVE THIS WHEN THE BOOKING FEATURE IS READY
	const bookedDates = Array.from({ length: 12 }, (_, i) => new CalendarDate(2025, 10, 15 + i));

	const formattedCheckinDate = $derived(
		bookingPrice.dateRange?.start
			? format(bookingPrice.dateRange.start.toDate(getLocalTimeZone()), 'MMM dd, yyyy')
			: 'Check-in'
	);
	const formattedCheckoutDate = $derived(
		bookingPrice.dateRange?.end
			? format(bookingPrice.dateRange.end.toDate(getLocalTimeZone()), 'MMM dd, yyyy')
			: 'Check-out'
	);

	function handleSubmit() {
		if (!bookingPrice.isValid) {
			toast.info('Some fields are invalid. Please check the form and try again.');
			return;
		}

		const checkin = bookingPrice.dateRange?.start?.toString();
		const checkout = bookingPrice.dateRange?.end?.toString();
		const guests = bookingPrice.guests;
		goto(
			`/checkout/summary?cabinId=${cabin.id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`
		);
	}
</script>

<div class="space-y-6">
	<div class="space-y-2">
		<Label for="dates">Pick your dates</Label>
		<Popover>
			<PopoverTrigger
				class={cn(
					buttonVariants({ variant: 'outline' }),
					'w-full justify-start text-left font-normal',
					!selectedDateRange.start && 'text-muted-foreground'
				)}
			>
				<CalendarIcon class="mr-2 size-4" />
				{#if selectedDateRange.start}
					{#if selectedDateRange.end}
						{df.format(selectedDateRange.start.toDate(getLocalTimeZone()))} -
						{df.format(selectedDateRange.end.toDate(getLocalTimeZone()))}
					{:else}
						{df.format(selectedDateRange.start.toDate(getLocalTimeZone()))}
					{/if}
				{:else}
					Pick a date range
				{/if}
			</PopoverTrigger>
			<PopoverContent class="w-auto p-0" align="start">
				<RangeCalendar
					bind:value={selectedDateRange}
					isDateUnavailable={(date) => bookedDates.some((d) => d.compare(date) === 0)}
					minValue={minCalendarDate}
					maxValue={maxCalendarDate}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	</div>

	<!-- Reemplazo para Field (Number of Guests) -->
	<div class="space-y-2">
		<Label for="guests">Number of guests</Label>
		<Input
			type="number"
			min="1"
			max={cabin.maxGuests}
			name="guests"
			bind:value={bookingPrice.guests}
		/>
	</div>

	<!-- Tarjeta unificada de Resumen de Booking -->
	<Item class="rounded-lg border bg-muted/30 p-4">
		{#if bookingPrice.nights > 0 && bookingPrice.isValid}
			<div class="w-full space-y-1 text-sm">
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">Check-in:</span>
					<span class="font-medium">{formattedCheckinDate}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground">Check-out:</span>
					<span class="font-medium">{formattedCheckoutDate}</span>
				</div>
				<div class="mt-2 flex items-center justify-between font-semibold">
					<span>Nights:</span>
					<span>{bookingPrice.nights}</span>
				</div>
			</div>

			<Separator class="my-3" />

			<Typography variant="h4" class="mb-0 text-center text-xl font-semibold text-primary">
				Estimated Total: ${bookingPrice.formatPrice(bookingPrice.totalPrice)}
			</Typography>
			<Typography variant="body" class="mb-0 text-center text-sm text-muted-foreground">
				The final price and detailed breakdown will be shown before completing your reservation.
			</Typography>
		{:else if !selectedDateRange.start || !selectedDateRange.end}
			<Typography variant="body" class="mb-0 text-center text-sm text-muted-foreground">
				Please select your check-in and check-out dates.
			</Typography>
		{:else if bookingPrice.nights === 0}
			<Typography variant="body" class="mb-0 text-center text-sm text-muted-foreground">
				Check-out date must be after check-in. Please adjust your selection.
			</Typography>
		{:else}
			<Typography variant="body" class="mb-0 text-center text-sm text-muted-foreground">
				Select valid dates and number of guests to see the estimated total.
			</Typography>
		{/if}
	</Item>

	<!-- Validation Errors -->
	{#if bookingPrice.errors.length > 0}
		<div class="space-y-1 rounded-lg border border-destructive bg-destructive/10 p-3">
			{#each bookingPrice.errors as error}
				<div class="text-sm text-destructive">• {error}</div>
			{/each}
		</div>
	{/if}

	<Button type="button" class="w-full" disabled={!bookingPrice.isValid} onclick={handleSubmit}>
		Book this cabin
	</Button>
</div>
