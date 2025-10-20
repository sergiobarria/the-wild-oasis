<script lang="ts">
	import { XCircleIcon } from '@lucide/svelte';

	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<div class="flex items-center justify-center px-4 py-16">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900"
			>
				<XCircleIcon class="h-10 w-10 text-red-600 dark:text-red-400" />
			</div>
			<CardTitle class="text-2xl">Booking Cancelled</CardTitle>
		</CardHeader>

		<CardContent class="text-center">
			<Typography variant="body" class="mb-4 text-muted-foreground">
				Your booking was cancelled and no charges were made.
			</Typography>
			<Typography variant="body" class="text-sm text-muted-foreground">
				If you encountered any issues during checkout, please don't hesitate to contact our support
				team.
			</Typography>
		</CardContent>

		<CardFooter class="flex flex-col gap-3">
			<Button href="/" class="w-full">Browse Cabins</Button>
			<Button href="/contact" variant="outline" class="w-full">Contact Support</Button>
		</CardFooter>
	</Card>
</div>
