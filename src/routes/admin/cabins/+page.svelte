<script lang="ts">
	import CabinsTable from './cabins-table.svelte';
	import Loader from '$lib/components/shared/loader.svelte';

	import NewCabinDialog from '$lib/components/cabins/new-cabin-dialog.svelte';
</script>

<div class="flex items-center justify-between">
	<h1 class="scroll-m-20 text-3xl font-extrabold tracking-wider lg:text-4xl">Cabins</h1>
	<NewCabinDialog />
</div>

<div class="pt-6 pb-12">
	<svelte:boundary>
		<CabinsTable />

		{#snippet pending()}
			<Loader label="Loading cabins..." />
		{/snippet}
	</svelte:boundary>
</div>
