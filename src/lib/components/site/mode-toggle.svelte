<script lang="ts">
	import { SunIcon, MoonStarIcon } from 'lucide-svelte';
	import { resetMode, setMode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '../ui/button';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<SunIcon class="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
		<MoonStarIcon
			class="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => resetMode}>System</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
