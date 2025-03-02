<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>The Wild Oasis</title>
	<meta name="description" content="The Wild Oasis is a place for all things nature." />
</svelte:head>

{@render children()}
