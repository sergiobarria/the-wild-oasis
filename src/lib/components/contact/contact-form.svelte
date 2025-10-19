<script lang="ts">
	import { contactUs } from '$lib/api/contact.remote';
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { ContactFormSchema } from '$lib/schemas/contact.schemas';

	import { Button } from '../ui/button';
	import { Spinner } from '../ui/spinner';
	import { Textarea } from '../ui/textarea';
</script>

<form {...contactUs.preflight(ContactFormSchema).enhance(async ({ data, form, submit }) => {})}>
	<FieldGroup class="grid grid-cols-1 gap-8 md:grid-cols-2">
		{@const nameIssues = contactUs.fields.name.issues() ?? []}
		<Field data-invalid={nameIssues.length > 0}>
			<FieldLabel for="name">Your name*</FieldLabel>
			<Input
				id="name"
				placeholder="John Doe"
				{...contactUs.fields.name.as('text')}
				aria-invalid={nameIssues.length > 0}
			/>
			{#each nameIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const emailIssues = contactUs.fields.email.issues() ?? []}
		<Field data-invalid={emailIssues.length > 0}>
			<FieldLabel for="email">Your email*</FieldLabel>
			<Input id="email" placeholder="john@example.com" {...contactUs.fields.email.as('email')} />
			{#each emailIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const subjectIssues = contactUs.fields.subject.issues() ?? []}
		<Field data-invalid={subjectIssues.length > 0}>
			<FieldLabel for="subject">Subject*</FieldLabel>
			<Input
				id="subject"
				placeholder="Subject"
				{...contactUs.fields.subject.as('text')}
				aria-invalid={subjectIssues.length > 0}
			/>
			{#each subjectIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const phoneIssues = contactUs.fields.phone.issues() ?? []}
		<Field data-invalid={phoneIssues.length > 0}>
			<FieldLabel for="phone">Your Phone</FieldLabel>
			<Input
				id="phone"
				placeholder="Your Phone"
				{...contactUs.fields.phone.as('text')}
				aria-invalid={phoneIssues.length > 0}
			/>
			{#each phoneIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const messageIssues = contactUs.fields.message.issues() ?? []}
		<Field data-invalid={messageIssues.length > 0} class="md:col-span-2">
			<FieldLabel for="message">Your Message*</FieldLabel>
			<Textarea
				id="message"
				placeholder="Write your message here..."
				rows={5}
				{...contactUs.fields.message.as('text')}
				aria-invalid={messageIssues.length > 0}
			/>
			{#each messageIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>
	</FieldGroup>

	<Button type="submit" class="mt-4" disabled={!!contactUs.pending}>
		{#if contactUs.pending}
			<Spinner />
			Sending...
		{:else}
			Send Message
		{/if}
	</Button>
</form>
