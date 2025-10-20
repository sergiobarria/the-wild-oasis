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
					aria-label={`View ${cabinName} image ${image.id + 1}`}
					class="group relative h-48 w-full overflow-hidden rounded-lg"
				>
					<img
						src={image.url}
						alt={`${cabinName} - Image ${image.id + 1}`}
						class="h-full w-full object-cover transition group-hover:brightness-110"
					/>
				</button>
			{/each}
		</div>

		<!-- Lightbox Modal -->
		{#if lightbox.show}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-labelledby="lightbox-title"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
				onclick={closeLightbox}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						closeLightbox();
					}
				}}
			>
				<!-- Hidden title for screen readers -->
				<span id="lightbox-title" class="sr-only">Image viewer</span>

				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="relative w-full max-w-4xl px-4"
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => e.stopPropagation()}
				>
					<img
						src={lightbox.image}
						alt={`${cabinName} - Expanded view`}
						class="mx-auto max-h-[90dvh] rounded-lg shadow-xl"
					/>
					<button
						type="button"
						onclick={closeLightbox}
						class="absolute top-5 right-10 rounded-full bg-accent p-2 text-3xl font-bold text-zinc-300 transition hover:text-white"
						aria-label="Close image viewer"
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
	/* Focus styles for accessibility */
	button:focus-visible {
		outline: 2px solid hsl(var(--primary));
		outline-offset: 2px;
	}

	/* Hide element visually but keep it for screen readers */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
