<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>The Wild Oasis</title>
</svelte:head>

{@render children()}
