<script>
	import { ModeWatcher } from 'mode-watcher';

	import '../app.css';

	let { children } = $props();
</script>

{@render children()}
<ModeWatcher defaultMode="dark" />
