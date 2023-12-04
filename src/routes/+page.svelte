<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<h1 class="text-3xl font-bold text-red-500 underline">Hello world!</h1>
<Button variant="default" on:click={() => alert('CLICKED!')}>Click me</Button>
