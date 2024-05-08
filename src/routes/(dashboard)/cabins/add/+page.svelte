<script lang="ts">
	import type { PageData } from './$types';
	import CabinForm from '../cabin-form.svelte';

	export let data: PageData;
</script>

<div class="flex items-center">
	<h1 class="text-3xl font-bold tracking-wide">Add a New Cabin</h1>
</div>

<p class="text-muted-foreground">Here you can view all cabins and their details.</p>

<hr class="my-6 border-gray-200" />

<div class="pb-10">
	<CabinForm data={data.form} />
</div>
