<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Toaster as ToasterTwo } from 'svelte-french-toast';

	import '../app.css';
</script>

<slot />
<Toaster />
<ToasterTwo />
<ModeWatcher defaultMode="light" />
