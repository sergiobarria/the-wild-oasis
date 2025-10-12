<script lang="ts">
	import SignOutButton from '$lib/components/shared/sign-out-button.svelte';
	import Typography from '$lib/components/shared/typography.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#if data.session}
	<Typography variant="h1">Guest</Typography>
	<Typography variant="body">Welcome back, {data.user?.email}</Typography>
{:else}
	<SignOutButton />
{/if}
