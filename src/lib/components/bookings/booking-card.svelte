<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { getLocalTimeZone } from '@internationalized/date';
	import { AlertCircleIcon, CalendarIcon } from '@lucide/svelte';
	import type { DateRange } from 'bits-ui';

	import { goto } from '$app/navigation';
	import { calculateBookingNights, calculateBookingPrice } from '$lib/booking/calculations';
	import { getFieldError, validateBooking } from '$lib/booking/validation';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import type { BookingPriceBreakdown, ValidationError } from '$lib/types/booking';
	import { formatBookingDate, formatPrice } from '$lib/utils';

	interface BookingCardProps {
		cabinId: string;
		pricePerNight: number;
		discountPercentage: number | null;
		maxGuests?: number;
		blockedDates?: Date[];
	}

	let {
		cabinId,
		pricePerNight,
		discountPercentage,
		maxGuests = 10,
		blockedDates = []
	}: BookingCardProps = $props();

	let open = $state<boolean>(false);
	let dates = $state<DateRange | undefined>();
	let guests = $state<number>(2);
	let validationErrors = $state<ValidationError[]>([]);
	let isSubmitting = $state<boolean>(false);

	let nights = $derived(calculateBookingNights(dates));
	let priceBreakdown = $derived<BookingPriceBreakdown | null>(
		calculateBookingPrice({
			dateRange: dates,
			guests,
			pricePerNight,
			discountPercentage
		})
	);

	let dateError = $derived(
		getFieldError(validationErrors, 'checkIn') ||
			getFieldError(validationErrors, 'checkOut') ||
			getFieldError(validationErrors, 'dateRange')
	);

	let guestError = $derived(getFieldError(validationErrors, 'guests'));
	let hasMultipleErrors = $derived(validationErrors.length > 1);

	const handleReserve = () => {
		isSubmitting = true;

		// Validation logic here
		const result = validateBooking({
			dateRange: dates,
			guests,
			maxGuests
		});

		if (!result.isValid) {
			validationErrors = result.errors;
			isSubmitting = false;
			return;
		}

		// Clear errors and proceed with booking
		validationErrors = [];

		// Ensure we have all required data
		if (!dates?.start || !dates?.end || !guests) {
			console.error('Missing booking information');
			isSubmitting = false;
			toast.error('Missing booking information. Please check your inputs.');
			return;
		}

		const params = new URLSearchParams({
			cabinId,
			checkIn: dates.start.toString(),
			checkOut: dates.end.toString(),
			guests: guests.toString()
		});

		goto(`/checkout/summary?${params.toString()}`);
	};
</script>

<div class="space-y-4">
	<!-- Error Summary (only shown if multiple errors) -->
	{#if hasMultipleErrors}
		<Alert variant="destructive">
			<AlertCircleIcon class="size-4" />
			<AlertTitle>Please correct the following issues:</AlertTitle>
			<AlertDescription>
				<ul class="mt-2 ml-4 list-disc space-y-1">
					{#each validationErrors as error}
						<li class="text-sm">{error.message}</li>
					{/each}
				</ul>
			</AlertDescription>
		</Alert>
	{/if}

	<div class="flex flex-col gap-3">
		<Label for="dates">Select your stay</Label>
		<Popover bind:open>
			<PopoverTrigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="justify-start" data-invalid={!!dateError}>
						<CalendarIcon />
						{#if dates?.start && dates?.end}
							{formatBookingDate(dates.start)} - {formatBookingDate(dates.end)}
						{:else}
							Select dates
						{/if}
					</Button>
				{/snippet}
			</PopoverTrigger>
			<PopoverContent class="w-auto overflow-hidden p-0" align="start">
				<RangeCalendar
					bind:value={dates}
					captionLayout="dropdown"
					onValueChange={() => {
						// Clear date errors when user changes dates
						if (validationErrors.length > 0) {
							validationErrors = validationErrors.filter(
								(err) => !['checkIn', 'checkOut', 'dateRange'].includes(err.field)
							);
						}
					}}
					isDateDisabled={(dateValue) => {
						// Convert DateValue to native Date for comparison
						const localTz = getLocalTimeZone();
						const jsDate = dateValue.toDate(localTz);

						// Disable dates in the past
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						jsDate.setHours(0, 0, 0, 0);

						if (jsDate < today) return true;

						// Disable blocked dates
						return blockedDates.some((blocked) => {
							const blockedDate = new Date(blocked);
							blockedDate.setHours(0, 0, 0, 0);
							return jsDate.getTime() === blockedDate.getTime();
						});
					}}
				/>
			</PopoverContent>
		</Popover>

		{#if dateError && !hasMultipleErrors}
			<p class="text-sm text-destructive italic">{dateError}</p>
		{/if}
	</div>

	<div class="flex flex-col gap-3">
		<Label for="guests" class="mt-4 px-1">Number of guests (Max. {maxGuests})</Label>
		<Input
			id="guests"
			name="guests"
			type="number"
			placeholder="1"
			min="1"
			max={maxGuests}
			bind:value={guests}
			class="w-full"
			oninput={() => {
				// Clear guest errors when user changes value
				if (validationErrors.length > 0) {
					validationErrors = validationErrors.filter((err) => err.field !== 'guests');
				}
			}}
			data-invalid={!!guestError}
		/>

		{#if guestError && !hasMultipleErrors}
			<p class="text-sm text-destructive italic">{guestError}</p>
		{/if}
	</div>

	<!-- Price breakdown -->
	{#if priceBreakdown}
		<div class="rounded-lg border bg-muted/30 p-4">
			<div class="space-y-2 text-sm">
				<div class="flex items-center justify-between">
					<span>Check-in:</span>
					<span>{formatBookingDate(dates?.start)}</span>
				</div>
				<div class="flex items-center justify-between">
					<span>Check-out:</span>
					<span>{formatBookingDate(dates?.end)}</span>
				</div>
				<div class="flex items-center justify-between">
					<span>Nights:</span>
					<span>{nights}</span>
				</div>
				{#if priceBreakdown.discount > 0}
					<div class="flex items-center justify-between text-green-600">
						<span>Discount ({discountPercentage}%):</span>
						<span>-{formatPrice(priceBreakdown.discount)}</span>
					</div>
				{/if}
			</div>

			<Separator class="my-3" />

			<Typography
				variant="h4"
				class="mb-0 flex w-full items-center justify-between text-xl font-semibold text-primary"
			>
				<span>Estimated Total:</span>
				<span>{formatPrice(priceBreakdown.totalPrice)}</span>
			</Typography>
			<Typography variant="body" class="mb-0 text-sm text-muted-foreground">
				Full breakdown will be shown before completing your reservation.
			</Typography>
		</div>
	{:else}
		<div class="rounded-lg border border-dashed bg-muted/20 p-4">
			<Typography variant="body" class="mb-0 text-center text-sm text-pretty text-muted-foreground">
				Select your dates and guests to see estimated total
			</Typography>
		</div>
	{/if}

	<Button class="w-full" onclick={handleReserve} disabled={!priceBreakdown || isSubmitting}>
		{#if isSubmitting}
			<Spinner />
		{/if}
		{isSubmitting ? 'Processing...' : 'Reserve'}
	</Button>
</div>

<style>
	:global([data-invalid='true']) {
		border-color: hsl(var(--destructive));
	}
</style>
