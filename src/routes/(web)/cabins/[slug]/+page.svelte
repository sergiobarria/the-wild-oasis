<script lang="ts">
	import {
		ArrowLeftIcon,
		BathIcon,
		BedDoubleIcon,
		CheckIcon,
		StarIcon,
		UserPlusIcon,
		XIcon
	} from '@lucide/svelte';
	import { format } from 'date-fns';

	import placeholder from '$lib/assets/placeholder.jpg';
	import BookingCard from '$lib/components/booking/booking-card.svelte';
	import CabinCard from '$lib/components/cabins/cabin-card.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { APP_NAME } from '$lib/config/constants';

	import { getCabin } from '../queries.remote';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const { cabin, recommended, amenities } = $derived(await getCabin(params.slug));

	const rating = $derived(
		cabin.reviews?.length > 0
			? cabin.reviews.reduce((acc, review) => acc + review.rating, 0) / cabin.reviews.length
			: 0
	);

	// Mock gallery images - change length to 0 to show no images message
	const galleryImages = Array.from({ length: 6 }, (_, i) => ({
		id: i,
		url: placeholder,
		alt: `${cabin?.name} - Image ${i + 1}`
	}));

	// Lightbox state
	let lightbox = $state<{ show: boolean; image: string }>({
		show: false,
		image: ''
	});

	function openLightbox(imageUrl: string) {
		lightbox = { show: true, image: imageUrl };
	}

	function closeLightbox() {
		lightbox = { show: false, image: '' };
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeLightbox();
		}
	}
</script>

<svelte:head>
	<title>{cabin?.name} | {APP_NAME}</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-8 py-12">
	<Button href="/cabins" variant="outline" class="mb-8">
		<ArrowLeftIcon />
		Back to cabins
	</Button>

	<!-- COVER IMAGE -->
	<div class="relative h-[60vh] overflow-hidden rounded-xl shadow">
		<img src={placeholder} alt={cabin?.name} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
		<div class="absolute bottom-6 left-6">
			<Typography variant="h1" size="xl" class="text-4xl font-bold">
				{cabin?.name}
			</Typography>
			<Typography class="mt-2 text-base">{cabin?.summary}</Typography>
		</div>
	</div>

	<!-- CONTENT -->
	<div class="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
		<!-- LEFT COLUMN -->
		<div class="space-y-10 leading-relaxed md:col-span-2">
			<div class="space-y-4">
				<blockquote class="mb-8 border-l-4 border-accent pl-4 text-lg italic">
					“The most relaxing vacation we've had in years. We’ll be back every winter.”
				</blockquote>

				<Typography size="xl" class="font-semibold text-primary">Description</Typography>
				<Typography class="text-base">{cabin?.description}</Typography>
			</div>

			<!-- Tags -->
			<div class="space-y-2 text-sm">
				<p>🌿 Perfect for couples seeking peace & nature</p>
				<p>🔥 Great for winter retreats with fireplace & hot tub</p>
				<p>👨‍👩‍👧 Ideal for families (max {cabin?.maxGuests} guests)</p>
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
			<div class="space-y-4">
				<Typography size="xl" class="font-semibold text-primary">Image Gallery</Typography>

				{#if galleryImages.length > 0}
					<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
						{#each galleryImages as image}
							<button
								type="button"
								onclick={() => openLightbox(image.url)}
								class="group relative overflow-hidden rounded-lg"
							>
								<img
									src={image.url}
									alt={`${cabin?.name} - ${image.id + 1}`}
									class="h-36 w-full object-cover transition hover:brightness-110"
								/>
							</button>
						{/each}
					</div>
				{:else}
					<Typography class="text-muted-foreground">
						There are no images for this cabin at this time.
					</Typography>
				{/if}
			</div>

			<!-- Policies -->
			<div class="space-y-4">
				<Typography size="xl" class="font-semibold text-primary">Good to know</Typography>
				<div class="space-y-2 text-sm">
					<p>🕒 Check-in: 3:00 PM – Check-out: 11:00 AM</p>
					<p>❌ No smoking inside. Pets allowed on request.</p>
					<p>💳 Full refund if cancelled 7+ days before check-in.</p>
				</div>
			</div>

			<!-- Reviews -->
			<div class="space-y-6">
				<Typography size="xl" class="font-semibold text-primary">Latest Reviews</Typography>

				{#if cabin.reviews.length === 0}
					<Typography class="text-muted-foreground">
						There are no reviews for this cabin at this time.
					</Typography>
				{/if}

				{#if cabin.reviews.length > 0}
					<ul class="space-y-4">
						{#each cabin.reviews as review}
							<li class="rounded-xl border p-6">
								<div class="mb-2 flex items-center justify-between">
									<div class="font-semibold">{review.author_name}</div>
									<div class="flex items-center gap-1 text-primary">
										{#each Array.from({ length: review.rating }, (_, i) => i + 1) as rating}
											<StarIcon class="size-4" />
										{/each}
									</div>
								</div>
								<Typography class="text-sm">{review.comment}</Typography>
								<Typography class="mt-2 mb-0 text-xs text-muted-foreground">
									{format(review.createdAt, 'PP')}
								</Typography>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<!-- RIGHT COLUMN -->
		<div class="sticky top-6 space-y-6 self-start rounded-xl border p-6 shadow md:col-span-1">
			<!-- Price -->
			<div>
				<Typography variant="body" size="sm" class="mb-0">From</Typography>
				<Typography variant="body" size="lg" class="text-2xl font-bold text-primary">
					${cabin?.pricePerNight?.toFixed(2)}
					<span class="font-normal">/ night</span>
				</Typography>
			</div>

			<!-- Rating -->
			<div class="flex items-center gap-2 text-sm">
				<StarIcon class="size-4 text-primary" />
				<span class="font-medium">{rating.toFixed(2)}</span>
				<span>of {cabin.reviews.length} reviews</span>
			</div>

			<!-- Specifications -->
			<ul class="flex items-center justify-between gap-4 text-sm text-zinc-400">
				<li class="flex flex-col items-center justify-center gap-2">
					<BathIcon class="size-4 text-primary" />
					{cabin?.baths}
					{cabin?.baths === 1 ? 'bathroom' : 'bathrooms'}
				</li>
				<li class="flex flex-col items-center justify-center gap-2">
					<BedDoubleIcon class="size-4 text-primary" />
					{cabin?.beds}
					{cabin?.beds === 1 ? 'bed' : 'beds'}
				</li>
				<li class="flex flex-col items-center justify-center gap-2">
					<UserPlusIcon class="size-4 text-primary" />
					Max {cabin?.maxGuests} guests
				</li>
			</ul>

			<Separator />

			<BookingCard />
		</div>
	</div>
</section>

<!-- Recommended Cabins -->
<section class="mx-auto max-w-7xl px-8 pt-12 pb-16">
	<Typography size="2xl" class="font-semibold">Recommended Cabins</Typography>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each recommended as cabin}
			<CabinCard {cabin} />
		{/each}
	</div>
</section>

<!-- Lightbox Modal -->
{#if lightbox.show}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
		onclick={closeLightbox}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-4xl px-4"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<img
				src={lightbox.image}
				alt="Expanded view"
				class="mx-auto max-h-[90dvh] rounded-lg shadow-xl"
			/>
			<button
				onclick={closeLightbox}
				class="absolute top-5 right-10 rounded-full bg-accent p-2 text-zinc-300 transition hover:text-white"
				aria-label="Close modal"
			>
				<XIcon class="size-6" />
			</button>
		</div>
	</div>
{/if}
