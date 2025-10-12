<script lang="ts" module>
	import type { ButtonProps } from '$lib/components/ui/button';

	export type SignOutButtonProps = ButtonProps & {
		withLabel?: boolean;
	};
</script>

<script lang="ts">
	import { LogOutIcon } from '@lucide/svelte';

	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let {
		withLabel,
		variant = 'ghost',
		size = 'default',
		class: className,
		children,
		...restProps
	}: SignOutButtonProps = $props();

	const handleSignOut = async () => {
		await authClient.signOut();
		await goto('/');
	};
</script>

<Button
	{variant}
	{size}
	class={cn('cursor-pointer', className)}
	onclick={handleSignOut}
	{...restProps}
>
	<LogOutIcon />
	{#if withLabel}Sign out{/if}
</Button>
