<script lang="ts">
	import { goto } from '$app/navigation';
	import { EllipsisIcon, Trash2Icon, EyeIcon } from 'lucide-svelte';

	import * as Dropdown from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let id: number;
</script>

<Dropdown.Root>
	<Dropdown.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative size-8 p-0">
			<EllipsisIcon class="size-6" />
		</Button>
	</Dropdown.Trigger>

	<Dropdown.Content align="end" class="min-w-[10rem]">
		<Dropdown.Group>
			<Dropdown.Label>Actions</Dropdown.Label>
			<Dropdown.Separator />

			<Dropdown.Item on:click={() => goto('/dashboard/cabins/' + id)} class="cursor-pointer">
				<EyeIcon class="size-4 mr-2" />
				View Cabin
			</Dropdown.Item>

			<form method="POST" action="?/delete">
				<!-- <input type="hidden" name="id" value={id} /> -->

				<Button
					role="menuitem"
					variant="ghost"
					type="submit"
					class="flex w-full justify-start cursor-pointer text-destructive px-2"
				>
					<Trash2Icon class="size-4 mr-2" />
					Delete Cabin
				</Button>
			</form>
		</Dropdown.Group>
	</Dropdown.Content>
</Dropdown.Root>
