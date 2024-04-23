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

	<Dropdown.Content>
		<Dropdown.Group>
			<Dropdown.Label>Actions</Dropdown.Label>
			<Dropdown.Separator />

			<Dropdown.Item on:click={() => goto('/cabins/' + id)} class="cursor-pointer">
				<EyeIcon class="size-4 mr-2" />
				View Cabin
			</Dropdown.Item>
			<Dropdown.Item class="cursor-pointer text-destructive">
				<Trash2Icon class="size-4 mr-2" />
				Delete Cabin
			</Dropdown.Item>
		</Dropdown.Group>
	</Dropdown.Content>
</Dropdown.Root>
