<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	function handleClick() {
		alert('Hello world!');
	}
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>
<Button on:click={handleClick}>Click me</Button>
