<script lang="ts">
	import { EyeIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-svelte';

	import { Button } from '$lib/components/ui/button';
	import * as Dropdown from '$lib/components/ui/dropdown-menu';

	export let id: string;
</script>

<Dropdown.Root>
	<Dropdown.Trigger asChild let:builder>
		<Button variant="ghost" size="sm" builders={[builder]}>
			<MoreHorizontalIcon class="size-4" />
		</Button>
	</Dropdown.Trigger>

	<Dropdown.Content>
		<Dropdown.Label>Actions</Dropdown.Label>
		<Dropdown.Separator />

		<Dropdown.Item href={`cabins/${id}`}>
			<EyeIcon class="mr-2 size-4" />
			View Details
		</Dropdown.Item>

		<form
			method="POST"
			on:submit={(e) =>
				!confirm('Are you sure you want to delete this? This action cannot be undone') &&
				e.preventDefault()}
		>
			<input type="hidden" name="id" value={id} />

			<Dropdown.Item>
				<button
					type="submit"
					class="flex cursor-default items-center gap-0.5 text-destructive"
				>
					<TrashIcon class="mr-2 size-4" />
					Delete
				</button>
			</Dropdown.Item>
		</form>
	</Dropdown.Content>
</Dropdown.Root>
