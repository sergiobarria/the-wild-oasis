<script lang="ts">
	import { goto } from '$app/navigation'
	import { PencilIcon, TrashIcon, MoreVerticalIcon } from 'lucide-svelte'

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import Button from './ui/button/button.svelte'

	export let cabinId: number
</script>

<AlertDialog.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button variant="outline" size="icon">
				<MoreVerticalIcon class="h-4 w-4" />
			</Button>
		</DropdownMenu.Trigger>

		<DropdownMenu.Content>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item
				class="cursor-pointer gap-2"
				on:click={() => goto(`/cabins/${cabinId}/edit`)}
			>
				<PencilIcon class="h-3 w-3" />
				Edit Cabin
			</DropdownMenu.Item>

			<AlertDialog.Trigger>
				<DropdownMenu.Item class="cursor-pointer gap-2 text-destructive">
					<TrashIcon class="h-3 w-3" />
					Delete Cabin
				</DropdownMenu.Item>
			</AlertDialog.Trigger>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the selected cabin and
				remove its data from the database.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<form method="POST">
				<input type="hidden" name="id" value={cabinId} />
				<AlertDialog.Action type="submit" class="btn btn-destructive">
					Delete
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
