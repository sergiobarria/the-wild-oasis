<script lang="ts">
	import { CircleAlertIcon } from '@lucide/svelte';

	import { page } from '$app/state';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';

	let error = $derived(page.error as App.Error | null);
	let status = $derived(page.status);
</script>

<div class="container mx-auto max-w-2xl px-8 py-16">
	<div class="text-center">
		<div class="mb-8">
			<CircleAlertIcon class="mx-auto size-16 text-destructive" />
		</div>

		<Typography variant="h1" size="3xl" class="mb-4">
			{status}: {error?.message || 'Something went wrong'}
		</Typography>

		{#if error?.details}
			<Alert variant="destructive" class="mb-8 text-left">
				<CircleAlertIcon class="size-4" />
				<AlertTitle>Details</AlertTitle>
				<AlertDescription>
					{error.details}
				</AlertDescription>
			</Alert>
		{/if}

		<div class="space-y-4">
			<Typography class="text-muted-foreground">
				{#if status === 400}
					The booking information provided is invalid. Please start over and select your dates and
					cabin again. If the problem persists, contact support.
				{:else}
					We couldn't process your booking. Please try again.
				{/if}
			</Typography>

			<div class="flex justify-center gap-4">
				<Button href="/cabins" variant="default">Browse Cabins</Button>
				<Button href="/" variant="outline">Go Home</Button>
			</div>
		</div>
	</div>
</div>
