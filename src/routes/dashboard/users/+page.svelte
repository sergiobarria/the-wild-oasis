<script lang="ts">
	import PageHeader from '$lib/components/site/page-header.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<PageHeader title="Users" />
