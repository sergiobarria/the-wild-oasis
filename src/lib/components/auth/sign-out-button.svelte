<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { LogOutIcon } from '@lucide/svelte';

	import { signout } from '$lib/api/auth.remote';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface SignOutButtonProps {
		withLabel?: boolean;
		variant?: 'ghost' | 'outline' | 'destructive';
		size?: 'sm' | 'lg';
		class?: string;
	}

	let {
		withLabel = false,
		variant = 'ghost',
		size = 'sm',
		class: className
	}: SignOutButtonProps = $props();
</script>

<form
	{...signout.enhance(async ({ form, data, submit }) => {
		try {
			await submit();
			form.reset();

			toast.success('Successfully signed out!');
		} catch (error) {
			toast.error('Oh no! Something went wrong');
		}
	})}
>
	<Button
		{variant}
		{size}
		type="submit"
		disabled={!!signout.pending}
		class={cn('cursor-pointer', className)}
	>
		<LogOutIcon />
		{#if withLabel}
			<span>Sign Out</span>
		{/if}
	</Button>
</form>
