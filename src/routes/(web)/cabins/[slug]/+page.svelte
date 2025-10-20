<script lang="ts">
	import {
		ArrowLeftIcon,
		BathIcon,
		BedDoubleIcon,
		CheckIcon,
		StarIcon,
		UserPlusIcon
	} from '@lucide/svelte';
	import { format } from 'date-fns';

	import { page } from '$app/state';
	import { getCabinBySlug } from '$lib/api/cabins.remote';
	import placeholder from '$lib/assets/placeholder.jpg';
	import BookingCard from '$lib/components/bookings/booking-card.svelte';
	import CabinCard from '$lib/components/cabins/cabin-card.svelte';
	import ImageGallery from '$lib/components/cabins/image-gallery.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { APP_NAME } from '$lib/config/app';
	import type { Review } from '$lib/server/db/schemas/reviews';

	const { cabin, amenities, recommended } = $derived(await getCabinBySlug(page.params.slug));

	const rating = $derived.by(() => {
		if (cabin.reviews.length === 0) return 0;
		const total = cabin.reviews.reduce((sum, review) => sum + review.rating, 0);

		return total / cabin.reviews.length;
	});

	// Mock data for image gallery until you have real images
	// Change the length to 0 to show the no images message
	const galleryImages = Array.from({ length: 6 }, (_, i) => ({
		id: i,
		url: placeholder
	}));
</script>

<svelte:head>
	<title>{cabin.name} - {APP_NAME}</title>
</svelte:head>

{#snippet reviewCard(review: Review)}
	<li class="rounded-xl border p-6">
		<div class="mb-2 flex items-center justify-between">
			<div class="font-semibold">{review.author_name}</div>
			<div class="flex items-center gap-1 text-primary">
				{#each Array.from({ length: 5 }, (_, i) => i + 1) as star}
					<StarIcon class="size-4 fill-primary" />
				{/each}
			</div>
		</div>
		<Typography class="text-sm">{review.comment}</Typography>
		<Typography class="mt-2 mb-0 text-xs text-muted-foreground">
			{format(review.createdAt, 'PP')}
		</Typography>
	</li>
{/snippet}

<section class="mx-auto max-w-7xl px-8 pt-12 pb-16">
	<Button href="/cabins" variant="link" class="p-0">
		<ArrowLeftIcon />
		Return to all cabins
	</Button>

	<!-- Cover image -->
	<div class="relative h-[60vh] overflow-hidden rounded-xl shadow">
		<img src={placeholder} alt={cabin.name} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
		<div class="absolute bottom-6 left-6">
			<Typography variant="h1" size="xl" class="text-4xl font-bold">
				{cabin.name}
			</Typography>
			<Typography class="mt-2 text-base">{cabin.summary}</Typography>
		</div>
	</div>

	<!-- Content -->
	<div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
		<!-- Left Column -->
		<div class="space-y-10 leading-relaxed md:col-span-2">
			<div class="space-y-4">
				<blockquote class="mb-8 border-l-4 border-accent pl-4 text-lg italic">
					“The most relaxing vacation we've had in years. We'll be back every winter.”
				</blockquote>

				<Typography size="xl" class="font-semibold text-primary">Description</Typography>
				<Typography class="text-base">{cabin.description}</Typography>
			</div>

			<!-- Tags -->
			<div class="space-y-2 text-sm">
				<p>🌿 Perfect for couples seeking peace & nature</p>
				<p>🔥 Great for winter retreats with fireplace & hot tub</p>
				<p>👨‍👩‍👧 Ideal for families (max {cabin.maxGuests} guests)</p>
			</div>

			<!-- Amenities -->
			<div class="space-y-4">
				<Typography size="xl" class="font-semibold text-primary">Amenities</Typography>
				<ul class="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
					{#each amenities as amenity}
						<li class="flex items-center gap-2">
							<CheckIcon class="size-4 text-primary" />
							{amenity.name}
						</li>
					{/each}
				</ul>
			</div>

			<!-- Image Gallery -->
			<ImageGallery cabinName={cabin.name} images={galleryImages} />

			<!-- Policies -->
			<div class="space-y-4">
				<Typography size="xl" class="font-semibold text-primary">Good to know</Typography>
				<div class="space-y-2 text-sm">
					<p>🕒 Check-in: 3:00 PM &apos; Check-out: 11:00 AM</p>
					<p>❌ No smoking inside. Pets allowed on request.</p>
					<p>💳 Full refund if cancelled 7+ days before check-in.</p>
				</div>
			</div>

			<!-- Latest Reviews -->
			<div class="space-y-6">
				<Typography size="xl" class="font-semibold text-primary">Latest Reviews</Typography>

				{#if cabin.reviews.length === 0}
					<Typography size="xl" class="font-semibold text-primary">No reviews yet</Typography>
				{/if}

				<ul class="space-y-4">
					{#each cabin.reviews as review}
						{@render reviewCard(review)}
					{/each}
				</ul>
			</div>
		</div>

		<!-- Right Column -->
		<div class="sticky top-6 space-y-6 self-start rounded-xl border p-6 shadow md:col-span-1">
			<!-- Price -->
			<div>
				<p class="text-sm">From</p>
				<p class="text-2xl font-bold text-primary">
					${cabin.pricePerNight?.toFixed(2)}
					<span class="font-normal">/ night</span>
				</p>
			</div>

			<!-- Rating -->
			<div class="flex items-center gap-2 text-sm">
				<StarIcon class="size-4 text-primary" />
				<span class="font-medium">{rating.toFixed(2)}</span>
				<span>of 5 ({cabin.reviews.length}) reviews</span>
			</div>

			<!-- Specifications -->
			<ul class="flex items-center justify-between gap-4 text-sm text-zinc-400">
				<li class="flex flex-col items-center justify-center gap-2">
					<BathIcon class="size-4 text-primary" />
					{cabin.baths}
					{cabin.baths === 1 ? 'bathroom' : 'bathrooms'}
				</li>
				<li class="flex flex-col items-center justify-center gap-2">
					<BedDoubleIcon class="size-4 text-primary" />
					{cabin.beds}
					{cabin.beds === 1 ? 'bed' : 'beds'}
				</li>
				<li class="flex flex-col items-center justify-center gap-2">
					<UserPlusIcon class="size-4 text-primary" />
					Max {cabin.maxGuests} guests
				</li>
			</ul>

			<Separator />

			<BookingCard
				cabinId={cabin.id}
				pricePerNight={cabin.pricePerNight}
				maxGuests={cabin.maxGuests}
				discountPercentage={cabin.discountPercentage}
			/>
		</div>
	</div>
</section>

<!-- Recommended Cabins -->
<section class="mx-auto max-w-7xl px-8 pt-12 pb-16">
	<Typography variant="h2" size="xl" class="text-4xl font-bold">Recommended Cabins</Typography>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each recommended as cabin}
			<CabinCard {cabin} />
		{/each}
	</div>
</section>
