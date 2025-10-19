<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CheckIcon, EyeIcon, EyeOffIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { signin } from '$lib/api/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput
	} from '$lib/components/ui/input-group';
	import { Spinner } from '$lib/components/ui/spinner';
	import { DEFAULT_REDIRECT_AFTER_LOGIN } from '$lib/config/app';
	import { SignInSchema } from '$lib/schemas/auth.schemas';

	import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

	let showPassword = $state<boolean>(false);
</script>

<form
	{...signin.preflight(SignInSchema).enhance(async ({ form, data, submit }) => {
		try {
			await submit();

			if (signin.result?.success) {
				const intended = page.url.searchParams.get('redirect');
				const redirectTo = intended || DEFAULT_REDIRECT_AFTER_LOGIN;

				toast.success('Successfully signed in! Welcome back.');
				await goto(redirectTo);
			}
		} catch (error) {
			toast.error('Oh no! Something went wrong');
		}
	})}
>
	<FieldGroup>
		{@const emailIssues = signin.fields.email.issues() ?? []}
		<Field data-invalid={emailIssues.length > 0}>
			<FieldLabel for="email">Your email</FieldLabel>
			<Input
				id="email"
				placeholder="john@email.com"
				{...signin.fields.email.as('email')}
				aria-invalid={emailIssues.length > 0}
			/>
			{#each emailIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const passwordIssues = signin.fields.password.issues() ?? []}
		<Field data-invalid={passwordIssues.length > 0}>
			<FieldLabel for="password">Your password</FieldLabel>
			<InputGroup>
				<InputGroupInput
					id="password"
					placeholder="••••••••"
					{...signin.fields.password.as(showPassword ? 'text' : 'password')}
					aria-invalid={passwordIssues.length > 0}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label="Toggle password visibility"
						title="Toggle password visibility"
						type="button"
						size="icon-xs"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeOffIcon />
						{:else}
							<EyeIcon />
						{/if}
						<span class="sr-only">Toggle password</span>
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			{#each passwordIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>
	</FieldGroup>

	{#if signin.result?.success === false}
		<Alert variant="destructive" class="mt-4">
			<CheckIcon />
			<AlertTitle>Oops! Something went wrong</AlertTitle>
			<AlertDescription>
				{signin.result?.error ?? 'Something went wrong. Please try again later.'}
			</AlertDescription>
		</Alert>
	{/if}

	<Button type="submit" class="mt-4 w-full" disabled={!!signin.pending}>
		{#if signin.pending}
			<Spinner />
			Signing in...
		{:else}
			Sign In
		{/if}
	</Button>
</form>
