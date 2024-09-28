<script lang="ts">
	import { MoonStarIcon, SunIcon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button onclick={toggleMode} variant="ghost" size="icon">
	<SunIcon class="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
	<MoonStarIcon
		class="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
