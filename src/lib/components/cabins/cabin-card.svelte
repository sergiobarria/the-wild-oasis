<script lang="ts">
	import { ArrowRightIcon, BathIcon, BedIcon, UserIcon } from '@lucide/svelte';

	import aboutImg from '$lib/assets/about-1.webp';
	import { Badge } from '$lib/components/ui/badge';
	import { Item, ItemContent, ItemTitle } from '$lib/components/ui/item';
	import type { Cabin } from '$lib/server/db/schemas/cabins';

	interface CabinCardProps {
		cabin: Cabin;
	}

	let { cabin }: CabinCardProps = $props();
</script>

<a
	href={`/cabins/${cabin.slug}`}
	class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
>
	<Item
		class="h-full overflow-hidden border border-border/50 bg-background p-0 shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:border-primary/20 hover:shadow-xl"
	>
		<!-- Image Section -->
		<!-- TODO: Use a real cabin image -->
		<div class="relative aspect-[4/3] w-full overflow-hidden">
			<img
				src={aboutImg}
				alt={`${cabin.name} cabin`}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>
			<!-- Gradient Overlay -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			></div>

			<!-- Price Badge -->
			<Badge class="absolute top-3 right-3 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-sm">
				<span class="text-lg font-bold">${cabin.pricePerNight.toFixed(2)}</span>
				<span class="ml-1 text-xs font-normal">/night</span>
			</Badge>
		</div>

		<!-- Content Section -->
		<ItemContent class="flex flex-col gap-4 p-5">
			<!-- Title -->
			<ItemTitle
				class="line-clamp-2 text-xl leading-tight font-bold transition-colors duration-200 group-hover:text-primary"
			>
				{cabin.name}
			</ItemTitle>

			<!-- Amenities Grid -->
			<div class="grid grid-cols-3 gap-3 text-sm text-muted-foreground">
				<div class="flex items-center gap-2">
					<UserIcon class="size-4 shrink-0 text-primary" />
					<span>{cabin.maxGuests} guests</span>
				</div>
				<div class="flex items-center gap-2">
					<BedIcon class="size-4 shrink-0 text-primary" />
					<span>{cabin.beds} beds</span>
				</div>
				<div class="flex items-center gap-2">
					<BathIcon class="size-4 shrink-0 text-primary" />
					<span>{cabin.baths} baths</span>
				</div>
			</div>

			<!-- CTA Section -->
			<div class="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
				<span class="font-semibold text-primary transition-colors group-hover:text-primary/80">
					View Details
				</span>
				<ArrowRightIcon
					class="size-5 text-primary transition-transform duration-200 group-hover:translate-x-1"
				/>
			</div>
		</ItemContent>
	</Item>
</a>
