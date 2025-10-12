<script lang="ts">
	import SignOutButton from '$lib/components/shared/sign-out-button.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SignOutButton />
