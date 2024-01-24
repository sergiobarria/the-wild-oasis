<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { ArrowLeftIcon } from 'lucide-svelte'

	import Button from '$lib/components/ui/button/button.svelte'
</script>

<Button variant="outline" size="icon" on:click={() => goto('/cabins')}>
	<ArrowLeftIcon class="h-4 w-4" />
</Button>
<h1>{$page.status}: {$page.error?.message}</h1>
