<script>
	import { Toaster } from 'svelte-french-toast';

	import Sidebar from '$lib/components/sidebar.svelte';
	import '../app.css';
</script>

<Toaster />
<div class="flex min-h-[100vh] gap-3">
	<Sidebar />

	<div class="flex-1">
		<header class="p-3">header</header>
		<main class="bg-neutral-100 p-5">
			<slot />
		</main>
	</div>
</div>
