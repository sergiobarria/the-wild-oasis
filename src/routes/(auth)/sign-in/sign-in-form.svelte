<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { CircleAlertIcon, EyeIcon, EyeOffIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { signIn } from '$lib/api/auth.remote';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '$lib/components/ui/field';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput
	} from '$lib/components/ui/input-group';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { SignInSchema } from '$lib/schemas/auth';

	let showPassword = $state<boolean>(false);
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
</script>

<form
	{...signIn.preflight(SignInSchema).enhance(async ({ data, form, submit }) => {
		try {
			status = 'loading';
			await submit();
			form.reset();

			if (signIn.result?.success) {
				goto('/');
				toast.success('Signed in successfully');
			}
		} catch (err: unknown) {
			toast.error('Something went wrong');
		} finally {
			status = 'idle';
		}
	})}
	class="space-y-6"
>
	<FieldSet>
		<FieldGroup class="gap-3">
			{@const emailIssues = signIn.fields.email.issues() ?? []}
			<Field data-invalid={emailIssues.length > 0}>
				<FieldLabel for="email">Tell us your email address</FieldLabel>
				<Input
					placeholder="iamawesome@email.com"
					{...signIn.fields.email.as('email')}
					aria-invalid={emailIssues.length > 0}
				/>
				{#each emailIssues as issue}
					<FieldError>{issue.message}</FieldError>
				{/each}
			</Field>

			{@const passwordIssues = signIn.fields.password.issues() ?? []}
			<Field data-invalid={passwordIssues.length > 0}>
				<FieldLabel for="password">Choose a secure password</FieldLabel>
				<InputGroup>
					<InputGroupInput
						placeholder="*********"
						{...signIn.fields.password.as(showPassword ? 'text' : 'password')}
						aria-invalid={passwordIssues.length > 0}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							aria-label="Show password"
							title="show password"
							size="icon-xs"
							tabindex={-1}
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOffIcon />
							{:else}
								<EyeIcon />
							{/if}
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
				{#each passwordIssues as issue}
					<FieldError>{issue.message}</FieldError>
				{/each}
			</Field>
		</FieldGroup>
	</FieldSet>

	{#if !signIn.result?.success && signIn.result?.error}
		<div class="rounded-lg border border-destructive bg-destructive/10 p-2">
			<div class="flex items-start gap-3">
				<div class="rounded-full bg-destructive/15 p-1.5">
					<CircleAlertIcon class="size-4 text-destructive" />
				</div>
				<div class="flex-1 space-y-1 text-sm">
					<Typography variant="h3" class="font-semibold text-destructive">
						Oops! Something went wrong
					</Typography>
					<Typography variant="body" class="text-destructive/90">
						{signIn.result?.error}
					</Typography>
				</div>
			</div>
		</div>
	{/if}

	<Button type="submit" disabled={status === 'loading'} class="w-full">
		{#if status === 'loading'}
			<Spinner />
		{/if}
		{status === 'loading' ? 'Signing in...' : 'Sign In'}
	</Button>
</form>
