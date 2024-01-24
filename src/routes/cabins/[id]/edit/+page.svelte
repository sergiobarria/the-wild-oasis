<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { ArrowLeftIcon } from 'lucide-svelte'

	import Button from '$lib/components/ui/button/button.svelte'

	export let data: PageData
</script>

<Button variant="outline" size="icon" on:click={() => goto('/cabins')}>
	<ArrowLeftIcon class="h-4 w-4" />
</Button>
<div>edit page for cabin id: {$page.params.id}</div>
<pre>{JSON.stringify(data.cabin, null, 2)}</pre>
