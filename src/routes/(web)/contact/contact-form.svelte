<script lang="ts">
	import { sendContactMessage } from '$lib/api/contact.remote';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldSet } from '$lib/components/ui/field';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ContactSchema } from '$lib/schemas/contact';

	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
</script>

<form
	{...sendContactMessage.preflight(ContactSchema).enhance(async ({ form, submit }) => {
		try {
			status = 'loading';
			await submit();
			status = 'success';
		} catch (err: unknown) {
			status = 'error';
		} finally {
			form.reset();
			status = 'idle';
		}
	})}
	class="mx-auto mt-12 max-w-4xl"
>
	<FieldSet class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{@const emailIssues = sendContactMessage.fields.email.issues() ?? []}
		<Field data-invalid={emailIssues.length > 0}>
			<Input
				placeholder="Enter your email address"
				{...sendContactMessage.fields.email.as('email')}
				aria-invalid={emailIssues.length > 0}
			/>
			{#each emailIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const nameIssues = sendContactMessage.fields.name.issues() ?? []}
		<Field data-invalid={nameIssues.length > 0}>
			<Input
				placeholder="Enter your name"
				{...sendContactMessage.fields.name.as('name')}
				aria-invalid={nameIssues.length > 0}
			/>
			{#each nameIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const subjectIssues = sendContactMessage.fields.subject.issues() ?? []}
		<Field data-invalid={subjectIssues.length > 0}>
			<Input
				placeholder="Enter your subject"
				{...sendContactMessage.fields.subject.as('subject')}
				aria-invalid={subjectIssues.length > 0}
			/>
			{#each subjectIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const phoneIssues = sendContactMessage.fields.phone.issues() ?? []}
		<Field data-invalid={phoneIssues.length > 0}>
			<Input
				placeholder="Enter your phone number"
				{...sendContactMessage.fields.phone.as('phone')}
				aria-invalid={phoneIssues.length > 0}
			/>
			{#each phoneIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const messageIssues = sendContactMessage.fields.message.issues() ?? []}
		<Field data-invalid={messageIssues.length > 0} class="col-span-2">
			<Textarea
				placeholder="Enter your message"
				{...sendContactMessage.fields.message.as('message')}
				rows={5}
				aria-invalid={messageIssues.length > 0}
			/>
			{#each messageIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>
	</FieldSet>

	<div class="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
		<Button type="submit" class="cursor-pointer" disabled={status === 'loading'}>
			{#if status === 'loading'}
				<Spinner />
			{/if}
			Send message
		</Button>

		{#if sendContactMessage.result?.success}
			<Typography variant="body" class="mt-4 mb-4 rounded-lg px-4 py-2 text-sm text-emerald-400">
				We have received your message and will get back to you as soon as possible.
			</Typography>
		{:else if sendContactMessage.result?.error}
			<Typography variant="body" class="mt-4 mb-4 rounded-lg px-4 py-2 text-sm text-destructive">
				{sendContactMessage.result?.error}
			</Typography>
		{/if}
	</div>
</form>
