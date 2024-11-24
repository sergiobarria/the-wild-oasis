<script lang="ts">
	import { page } from '$app/stores';
	import { HomeIcon, SlashIcon } from 'lucide-svelte';

	import * as Breadcrumb from '$lib/components/ui/breadcrumb';

	const breadcrumbs = $derived.by(() => {
		const segments = $page.url.pathname.split('/').filter(Boolean);

		return segments.map((segment, index) => {
			const path = '/' + segments.slice(0, index + 1).join('/');
			const name = segment.charAt(0).toUpperCase() + segment.slice(1);

			return { path, name };
		});
	});
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/dashboard">
				<HomeIcon class="size-4" />
			</Breadcrumb.Link>
			{#if breadcrumbs.length > 0}
				<Breadcrumb.Separator>
					<SlashIcon class="size-4" />
				</Breadcrumb.Separator>
			{/if}

			<!-- Dynamic Segments -->
			{#each breadcrumbs.slice(1) as segment, index}
				<Breadcrumb.Item>
					{#if index < breadcrumbs.length - 1}
						<Breadcrumb.Link href={segment.path}>{segment.name}</Breadcrumb.Link>
					{:else}
						<Breadcrumb.Page>{segment.name}</Breadcrumb.Page>
					{/if}
				</Breadcrumb.Item>
				{#if index < breadcrumbs.slice(1).length - 1}
					<Breadcrumb.Separator>
						<SlashIcon class="size-4" />
					</Breadcrumb.Separator>
				{/if}
			{/each}
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
