<script lang="ts">
	import { ensureAuthenticated } from '$lib/api/auth.remote';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { user } = await ensureAuthenticated();
</script>

<div>{user.email}</div>
