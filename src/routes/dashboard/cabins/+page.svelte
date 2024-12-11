<script lang="ts">
	import PageHeader from '$lib/components/site/page-header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircleIcon } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

{#snippet actions()}
	<div>
		<Button href="/dashboard/cabins/new" color="primary">
			<PlusCircleIcon class="size-4" />
			New Cabin
		</Button>
	</div>
{/snippet}

<PageHeader title="Cabins" {actions} />

<pre>
	{JSON.stringify(data.cabins, null, 2)}
</pre>
