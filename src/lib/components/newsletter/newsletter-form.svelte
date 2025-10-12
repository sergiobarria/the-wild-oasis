<script lang="ts">
	import { subscribeToNewsletter } from '$lib/api/newsletter.remote';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldSet } from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { NewsletterSubscriberSchema } from '$lib/schemas/newsletter-subscriber';
</script>

<form
	{...subscribeToNewsletter.preflight(NewsletterSubscriberSchema)}
	class="mt-6 flex flex-col gap-2 sm:flex-row"
>
	<FieldSet class="flex-1">
		{@const emailIssues = subscribeToNewsletter.fields.email.issues() ?? []}
		<Field data-invalid={emailIssues.length > 0}>
			<Input
				placeholder="Enter your email address"
				{...subscribeToNewsletter.fields.email.as('email')}
				aria-invalid={emailIssues.length > 0}
			/>
			{#each emailIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>
	</FieldSet>
	<Button type="submit" class="cursor-pointer">Subscribe</Button>
</form>

{#if subscribeToNewsletter.result?.success}
	<Typography variant="body" class="mt-4 mb-4 rounded-lg px-4 py-2 text-sm text-emerald-400">
		You have successfully subscribed to our newsletter!
	</Typography>
{:else if subscribeToNewsletter.result?.error}
	<Typography variant="body" class="mt-4 mb-4 rounded-lg px-4 py-2 text-sm text-destructive">
		{subscribeToNewsletter.result?.error}
	</Typography>
{/if}
