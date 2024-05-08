<script lang="ts">
	import { page } from '$app/stores';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	let breadcrumbs = [];
	$: breadcrumbs = $page.url.pathname
		.split('/')
		.filter(Boolean)
		.map((path, index, arr) => {
			const href = `/${arr.slice(0, index + 1).join('/')}`;
			return { label: path, href };
		});
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#each breadcrumbs as { label, href }, index}
			<Breadcrumb.Item class="capitalize">
				<Breadcrumb.Link {href}>
					{label}
				</Breadcrumb.Link>
			</Breadcrumb.Item>
			{#if index < breadcrumbs.length - 1}
				<Breadcrumb.Separator />
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
