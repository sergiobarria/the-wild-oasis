<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

edit cabin: {$page.params.id}

<pre>
	{JSON.stringify(data.cabin)}
</pre>
