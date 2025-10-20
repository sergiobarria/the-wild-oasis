<script lang="ts">
	import { parseDateTime } from '@internationalized/date';
	import { ArrowLeftIcon, CalendarDaysIcon, InfoIcon, MoonIcon, UsersIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { getCabinById } from '$lib/api/cabins.remote';
	import { confirmCheckout } from '$lib/api/checkout.remote';
	import placeholder from '$lib/assets/placeholder.jpg';
	import { calculateBookingNights, calculateBookingPrice } from '$lib/booking/calculations';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import { APP_NAME } from '$lib/config/app';
	import { formatBookingDate, formatPrice } from '$lib/utils';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let status = $state<'idle' | 'processing' | 'error'>('idle');
	let errorMessage = $state<string | null>(null);

	// Convert ISO strings back to DateValue objects
	const checkIn = parseDateTime(data.checkIn);
	const checkOut = parseDateTime(data.checkOut);

	const nights = calculateBookingNights({
		start: checkIn,
		end: checkOut
	});

	const cabin = $derived(await getCabinById(data.cabinId));

	const priceBreakdown = $derived.by(() => {
		const breakdown = calculateBookingPrice({
			dateRange: { start: checkIn, end: checkOut },
			guests: data.guests,
			pricePerNight: cabin.pricePerNight,
			discountPercentage: cabin.discountPercentage
		});

		// Assert non-null since we've validated the booking params
		if (!breakdown) {
			throw new Error('Failed to calculate price breakdown');
		}

		return breakdown;
	});

	const isAuthenticated = $derived(!!data.session);

	const handleConfirmBooking = async () => {
		status = 'processing';
		if (!data.user?.id) {
			goto(`/login?redirect=/checkout/summary`);
			return;
		}

		try {
			const result: { sessionId: string; url: string | null } = await confirmCheckout({
				cabinId: cabin.id,
				userId: data.user.id,
				cabinName: cabin.name,
				checkIn: checkIn.toString(),
				checkOut: checkOut.toString(),
				guests: data.guests,
				nights,
				subtotal: priceBreakdown.subtotal,
				discount: priceBreakdown.discount,
				cleaningFee: priceBreakdown.cleaningFee,
				serviceFee: priceBreakdown.serviceFee,
				bookingFee: priceBreakdown.bookingFee,
				tax: priceBreakdown.tax,
				totalPrice: priceBreakdown.totalPrice
			});

			if (result.url) {
				window.location.href = result.url;
			}
		} catch (err: unknown) {
			console.error('Booking confirmation failed:', err);
			status = 'error';
			errorMessage = 'Failed to confirm booking. Please try again.';
		} finally {
			status = 'idle';
		}
	};
</script>

<svelte:head>
	<title>Review Your Reservation - {APP_NAME}</title>
</svelte:head>

<div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<Button variant="ghost" size="sm" class="cursor-pointer" onclick={() => window.history.back()}>
			<ArrowLeftIcon />
			Back to cabin
		</Button>

		<div class="mb-10">
			<Typography variant="h2" class="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
				Review your reservation
			</Typography>
			<Typography variant="body" class="text-lg text-muted-foreground">
				One last look before you book
			</Typography>
		</div>

		<!-- Grid Layout -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content - Takes 2 columns on large screens -->
			<div class="space-y-6 lg:col-span-2">
				<!-- Cabin Preview -->
				<Card class="overflow-hidden pt-0">
					<div class="relative overflow-hidden">
						<div class="aspect-video">
							<img src={placeholder} alt={cabin.name} class="h-full w-full object-cover" />
						</div>
						{#if cabin.discountPercentage && cabin.discountPercentage > 0}
							<Badge
								variant="secondary"
								class="absolute top-4 right-4 bg-green-600 text-white hover:bg-green-700"
							>
								Save {cabin.discountPercentage}%
							</Badge>
						{/if}
					</div>
					<CardHeader class="space-y-1">
						<CardTitle>
							<Typography variant="h3" size="2xl">
								{cabin.name}
							</Typography>
						</CardTitle>
						<Typography variant="body" size="lg" class="mb-1 leading-relaxed text-muted-foreground">
							{cabin.summary}
						</Typography>
						<Typography variant="body" size="lg" class="mb-1 leading-relaxed text-muted-foreground">
							{cabin.description}
						</Typography>
					</CardHeader>
				</Card>

				<!-- Booking Details -->
				<Card>
					<CardHeader>
						<CardTitle>Booking details</CardTitle>
					</CardHeader>
					<CardContent class="space-y-6">
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="space-y-2">
								<div class="flex items-center gap-2 font-medium">
									<CalendarDaysIcon class="size-5 text-primary" />
									<span>Check-in</span>
								</div>
								<Typography variant="body" class="pl-7 text-muted-foreground">
									{formatBookingDate(parseDateTime(checkIn.toString()))}
								</Typography>
							</div>
							<div class="space-y-2">
								<div class="flex items-center gap-2 font-medium">
									<CalendarDaysIcon class="size-5 text-primary" />
									<span>Check-out</span>
								</div>
								<Typography variant="body" class="pl-7 text-muted-foreground">
									{formatBookingDate(parseDateTime(checkOut.toString()))}
								</Typography>
							</div>
						</div>

						<Separator />

						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2 font-medium">
								<MoonIcon class="size-5 text-primary" />
								<span>Duration</span>
							</div>
							<Typography variant="body" class="text-muted-foreground">
								{nights}
								{nights === 1 ? 'night' : 'nights'}
							</Typography>
						</div>

						<Separator />

						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2 font-medium">
								<UsersIcon class="size-5 text-primary" />
								<span>Guests</span>
							</div>
							<Typography variant="body" class="text-muted-foreground">
								{data.guests}
								{data.guests === 1 ? 'guest' : 'guests'}
							</Typography>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Price Summary - Takes 1 column, sticky on large screens -->
			<div class="lg:col-span-1">
				<div class="lg:sticky lg:top-8">
					<Card>
						<CardHeader>
							<CardTitle>Price Summary</CardTitle>
						</CardHeader>

						<CardContent class="space-y-3">
							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">
									{formatPrice(cabin.pricePerNight)} × {nights}{' '}
									{nights === 1 ? 'night' : 'nights'}
								</span>
								<span class="font-medium">{formatPrice(priceBreakdown.basePrice)}</span>
							</div>

							{#if priceBreakdown.discount > 0}
								<div class="flex justify-between text-sm">
									<span class="text-green-600 dark:text-green-400">Discount</span>
									<span class="font-medium text-green-600 dark:text-green-400">
										-{formatPrice(priceBreakdown.discount)}
									</span>
								</div>
							{/if}

							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Cleaning fee</span>
								<span class="font-medium">{formatPrice(priceBreakdown.cleaningFee)}</span>
							</div>

							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Service fee</span>
								<span class="font-medium">{formatPrice(priceBreakdown.serviceFee)}</span>
							</div>

							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Booking fee</span>
								<span class="font-medium">{formatPrice(priceBreakdown.bookingFee)}</span>
							</div>

							<div class="flex justify-between text-sm">
								<span class="text-muted-foreground">Taxes</span>
								<span class="font-medium">{formatPrice(priceBreakdown.tax)}</span>
							</div>

							<Separator class="my-4" />

							<div class="flex items-baseline justify-between pt-2">
								<span class="text-lg font-semibold">Total</span>
								<div class="text-right">
									<div class="text-3xl font-bold">
										{formatPrice(priceBreakdown.totalPrice)}
									</div>
									<div class="text-xs text-muted-foreground">USD</div>
								</div>
							</div>
						</CardContent>

						<CardFooter class="flex-col gap-3 pt-6">
							{#if isAuthenticated}
								<Button class="w-full" size="lg" onclick={handleConfirmBooking}>
									{#if status === 'processing'}
										<Spinner />
										Processing...
									{:else}
										Confirm booking
									{/if}
								</Button>
							{:else}
								<Button
									class="w-full"
									size="lg"
									onclick={() => goto(`/login?redirect=/checkout/summary`)}
								>
									Log in to book
								</Button>
								<Typography variant="body" size="xs" class="text-center text-muted-foreground">
									You won't be charged yet
								</Typography>
							{/if}

							{#if status === 'error' && errorMessage}
								<Typography variant="body" size="sm" class="text-center text-red-600">
									{errorMessage}
								</Typography>
							{/if}

							<div class="flex w-full items-start gap-2 rounded-lg border p-3">
								<InfoIcon class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
								<Typography variant="body" size="xs" class="leading-relaxed text-muted-foreground">
									Free cancellation available before check-in
								</Typography>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	</div>
</div>
