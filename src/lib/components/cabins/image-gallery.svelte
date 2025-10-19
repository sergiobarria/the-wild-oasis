<script lang="ts">
	import { XIcon } from '@lucide/svelte';

	import Typography from '$lib/components/shared/typography.svelte';

	interface ImageGalleryProps {
		cabinName: string;
		images?: Array<{ id: number; url: string }>;
	}

	let { cabinName, images = [] }: ImageGalleryProps = $props();

	// Lightbox state
	let lightbox = $state<{
		show: boolean;
		image: string;
	}>({ show: false, image: '' });

	// Open lightbox
	const openLightbox = (imageUrl: string) => {
		lightbox = { show: true, image: imageUrl };
	};

	// Close lightbox
	const closeLightbox = () => {
		lightbox = { show: false, image: '' };
	};

	// Handle escape key
	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && lightbox.show) {
			closeLightbox();
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="space-y-4">
	<Typography size="xl" class="font-semibold text-primary">Image Gallery</Typography>

	{#if images.length > 0}
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each images as image (image.id)}
				<button
					type="button"
					onclick={() => openLightbox(image.url)}
					class="group relative h-48 w-full overflow-hidden rounded-lg"
				>
					<img
						src={image.url}
						alt={`${cabinName} - ${image.id + 1}`}
						class="h-full w-full object-cover transition group-hover:brightness-110"
					/>
				</button>
			{/each}
		</div>

		<!-- Lightbox Modal -->
		{#if lightbox.show}
			<div
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
				onclick={closeLightbox}
				role="dialog"
				aria-modal="true"
				aria-label="Image lightbox"
			>
				<div class="relative w-full max-w-4xl px-4" onclick={(e) => e.stopPropagation()}>
					<img
						src={lightbox.image}
						alt="Expanded view"
						class="mx-auto max-h-[90dvh] rounded-lg shadow-xl"
					/>
					<button
						onclick={closeLightbox}
						class="absolute top-5 right-10 rounded-full bg-accent p-2 text-3xl font-bold text-zinc-300 transition hover:text-white"
						aria-label="Close modal"
					>
						<XIcon class="size-6" />
					</button>
				</div>
			</div>
		{/if}
	{:else}
		<Typography class="text-base">There are no images for this cabin at this time.</Typography>
	{/if}
</div>

<style>
	/* Optional: Add focus styles for accessibility */
	button:focus-visible {
		outline: 2px solid hsl(var(--primary));
		outline-offset: 2px;
	}
</style>
