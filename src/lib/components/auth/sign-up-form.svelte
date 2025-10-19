<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CheckCircle2Icon, EyeIcon, EyeOffIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { signUp } from '$lib/api/auth.remote';
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
	import { SignUpSchema } from '$lib/schemas/auth.schemas';

	import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

	let showPassword = $state<boolean>(false);
	let showConfirmPassword = $state<boolean>(false);
</script>

<form
	{...signUp.preflight(SignUpSchema).enhance(async ({ form, data, submit }) => {
		try {
			await submit();
			form.reset();

			goto(DEFAULT_REDIRECT_AFTER_LOGIN);
			toast.success(
				'Account created successfully! Please check your email to verify your account.'
			);
		} catch (error) {
			toast.error('Oh no! Something went wrong');
		}
	})}
>
	<FieldGroup>
		{@const emailIssues = signUp.fields.email.issues() ?? []}
		<Field data-invalid={emailIssues.length > 0}>
			<FieldLabel for="email">Tell us your email</FieldLabel>
			<Input
				id="email"
				placeholder="john@email.com"
				{...signUp.fields.email.as('email')}
				aria-invalid={emailIssues.length > 0}
			/>
			{#each emailIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>

		{@const passwordIssues = signUp.fields.password.issues() ?? []}
		<Field data-invalid={passwordIssues.length > 0}>
			<FieldLabel for="password">Add a secure password</FieldLabel>
			<InputGroup>
				<InputGroupInput
					id="password"
					placeholder="••••••••"
					{...signUp.fields.password.as(showPassword ? 'text' : 'password')}
					aria-invalid={passwordIssues.length > 0}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label="Toggle password visibility"
						title="Toggle password visibility"
						type="button"
						size="icon-xs"
						onclick={() => (showPassword = !showPassword)}
						tabindex={-1}
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

		{@const confirmPasswordIssues = signUp.fields.passwordConfirmation.issues() ?? []}
		<Field data-invalid={confirmPasswordIssues.length > 0}>
			<FieldLabel for="confirm-password">Confirm your password</FieldLabel>
			<InputGroup>
				<InputGroupInput
					id="confirm-password"
					placeholder="••••••••"
					{...signUp.fields.passwordConfirmation.as(showConfirmPassword ? 'text' : 'password')}
					aria-invalid={confirmPasswordIssues.length > 0}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label="Toggle password visibility"
						title="Toggle password visibility"
						type="button"
						size="icon-xs"
						onclick={() => (showConfirmPassword = !showConfirmPassword)}
						tabindex={-1}
					>
						{#if showConfirmPassword}
							<EyeOffIcon />
						{:else}
							<EyeIcon />
						{/if}
						<span class="sr-only">Toggle password</span>
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			{#each confirmPasswordIssues as issue}
				<FieldError>{issue.message}</FieldError>
			{/each}
		</Field>
	</FieldGroup>

	{#if signUp.result?.success === false}
		<Alert variant="destructive" class="mt-4">
			<CheckCircle2Icon />
			<AlertTitle>Oops! Something went wrong</AlertTitle>
			<AlertDescription>
				{signUp.result?.error ?? 'Something went wrong. Please try again later.'}
			</AlertDescription>
		</Alert>
	{/if}

	<Button type="submit" class="mt-4 w-full" disabled={!!signUp.pending}>
		{#if signUp.pending}
			<Spinner />
			Creating account...
		{:else}
			Create Account
		{/if}
	</Button>
</form>
