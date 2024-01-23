<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<h1 class="text-red-500">Welcome to SvelteKit</h1>
<Button variant="outline" on:click={() => console.log('CLICKED!')}>Click Me</Button>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
