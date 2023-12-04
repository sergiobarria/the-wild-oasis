<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';

	export let href: string;
	export let name: string;

	$: pathname = new URL($page.url).pathname;
</script>

<li class="group text-sm">
	<a
		{href}
		class={cn(
			'flex items-center gap-3 rounded-md px-5 py-3 text-neutral-600 hover:bg-neutral-100',
			pathname === href && 'bg-neutral-100 text-primary'
		)}
	>
		<slot />
		<span>{name}</span>
	</a>
</li>
