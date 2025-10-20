<script lang="ts">
	import { ExternalLinkIcon } from '@lucide/svelte';

	import DashboardSidebarTrigger from '$lib/components/dashboard/sidebar-trigger.svelte';
	import ThemeToggle from '$lib/components/shared/theme-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<header class="flex items-center justify-between px-5 py-4">
	<div class="flex items-center gap-2">
		<DashboardSidebarTrigger />

		<Separator orientation="vertical" class="h-6" />

		<Button href="/" variant="outline">
			View Website
			<ExternalLinkIcon />
		</Button>
	</div>

	<ThemeToggle />
</header>
