<script>
	import Sidebar from '$lib/components/sidebar.svelte';
	import '../app.css';
</script>

<div class="grid h-screen grid-cols-[14rem_1fr] grid-rows-[auto_1fr]">
	<header class="border-b border-neutral-100 bg-white px-10 py-6">HEADER</header>
	<Sidebar />
	<main class="bg-neutral-50 px-10 py-14">
		<slot />
	</main>
</div>
