<script lang="ts">
	import { APP_NAME } from '$lib/config/constants';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Terms of Service - {APP_NAME}</title>
</svelte:head>
