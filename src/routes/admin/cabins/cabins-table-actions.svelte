<script lang="ts">
	import {
		ClipboardCopyIcon,
		CopyIcon,
		EllipsisIcon,
		PencilRulerIcon,
		Trash2Icon
	} from '@lucide/svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { deleteCabin, getCabins } from '$lib/data-access/cabins.remote';

	let { id }: { id: string } = $props();

	function handleCopyId() {
		navigator.clipboard.writeText(id);
		toast('ID Copied to clipboard');
	}

	async function handleDeleteCabin() {
		try {
			await deleteCabin(id);
			getCabins().refresh();
			toast.success('Cabin deleted successfully');
		} catch (err: unknown) {
			console.error(err);
			toast.error('Failed to delete cabin');
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 cursor-pointer p-0"
			>
				<span class="sr-only">Open Menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>

			<DropdownMenu.Separator />

			<DropdownMenu.Item onclick={handleCopyId}>
				<CopyIcon />
				Copy Cabin ID
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<ClipboardCopyIcon />
				Duplicate Cabin
			</DropdownMenu.Item>

			<DropdownMenu.Item>
				<PencilRulerIcon />
				Edit Cabin
			</DropdownMenu.Item>

			<DropdownMenu.Item class="text-destructive" onclick={handleDeleteCabin}>
				<Trash2Icon class="text-destructive" />
				Delete Cabin
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
