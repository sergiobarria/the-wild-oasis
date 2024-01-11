<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="font-semibold">{$page.status}: {$page.error?.message}</h1>
<a href="/cabins" class="btn btn-primary">Go Home</a>
