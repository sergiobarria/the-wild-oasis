<script lang="ts">
	import { CheckCircle2Icon } from '@lucide/svelte';

	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';

	const MOCK_BOOKING = {
		nights: 3,
		totalPrice: 120
	};
</script>

{#if !MOCK_BOOKING}
	<div class="flex items-center justify-center py-12">
		<Card class="w-full max-w-md">
			<CardHeader>
				<CardTitle>Booking Not Found</CardTitle>
			</CardHeader>
			<CardContent>
				<Typography variant="body"
					>We couldn't find your booking. Please contact support.</Typography
				>
			</CardContent>
			<CardFooter>
				<Button href="/" class="w-full">Return Home</Button>
			</CardFooter>
		</Card>
	</div>
{:else}
	<div class="flex items-center justify-center py-12">
		<Card class="w-full max-w-2xl">
			<CardHeader class="text-center">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900"
				>
					<CheckCircle2Icon class="h-10 w-10 text-green-600 dark:text-green-400" />
				</div>
				<CardTitle class="text-3xl">Booking Confirmed!</CardTitle>
				<Typography variant="body" class="text-lg text-muted-foreground">
					Your reservation has been successfully confirmed
				</Typography>
			</CardHeader>

			<CardContent class="space-y-6">
				<div class="rounded-lg border bg-muted/50 p-6">
					<Typography variant="h4" class="mb-4 text-xl font-semibold"
						>Reservation Details</Typography
					>

					<div class="space-y-3">
						<div class="flex justify-between">
							<span class="text-muted-foreground">Nights</span>
							<span class="font-medium">
								{MOCK_BOOKING.nights}
								{MOCK_BOOKING.nights === 1 ? 'night' : 'nights'}
							</span>
						</div>

						<div class="my-4 border-t"></div>

						<div class="flex justify-between text-lg font-semibold">
							<span>Total Paid</span>
							<span>${MOCK_BOOKING.totalPrice.toFixed(2)}</span>
						</div>
					</div>
				</div>

				<div
					class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950"
				>
					<Typography variant="body" size="sm" class="text-blue-900 dark:text-blue-100">
						A confirmation email has been sent to your email address with all the details of your
						reservation.
					</Typography>
				</div>
			</CardContent>

			<CardFooter class="flex gap-3">
				<Button href="/" variant="outline" class="flex-1">Return Home</Button>
				<Button href="/guest" class="flex-1">View My Bookings</Button>
			</CardFooter>
		</Card>
	</div>
{/if}
