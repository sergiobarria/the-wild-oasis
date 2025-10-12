<script lang="ts">
	import { ArrowRightIcon, BathIcon, BedIcon, UserIcon } from '@lucide/svelte';

	import placeholder from '$lib/assets/placeholder.jpg';
	import { Button } from '$lib/components/ui/button';
	import { Item, ItemContent, ItemTitle } from '$lib/components/ui/item';
	import type { Cabin } from '$lib/server/db/schemas';

	let { cabin }: { cabin: Cabin } = $props();
</script>

<Item class="bg-background p-0">
	<img src={placeholder} alt={cabin.name} class="h-56 w-full object-cover" />

	<ItemContent class="space-y-2">
		<ItemTitle class="text-lg">{cabin.name}</ItemTitle>
		<span class="text-xl font-semibold text-primary">
			${cabin.pricePerNight.toFixed(2)} / night
		</span>

		<ul class="flex gap-6 text-sm">
			<li class="flex items-center gap-1">
				<UserIcon class="size-4 text-primary" />
				{cabin.maxGuests} guests
			</li>
			<li class="flex items-center gap-1">
				<BedIcon class="size-4 text-primary" />
				{cabin.beds} beds
			</li>
			<li class="flex items-center gap-1">
				<BathIcon class="size-4 text-primary" />
				{cabin.baths} bathrooms
			</li>
		</ul>

		<div class="flex items-center">
			<Button href={`/cabins/${cabin.slug}`} variant="link" size="link">
				View details
				<ArrowRightIcon class="size-4" />
			</Button>
		</div>
	</ItemContent>
</Item>
