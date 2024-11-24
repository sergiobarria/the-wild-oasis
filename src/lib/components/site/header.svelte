<script lang="ts">
	import Breadcrumbs from './breadcrumbs.svelte';
	import ModeToggle from './mode-toggle.svelte';
</script>

<header class="mb-8 flex h-10 w-full items-center justify-between">
	<div class="flex items-center gap-3">
		<Breadcrumbs />
	</div>
	<div>
		<ModeToggle />
	</div>
</header>
