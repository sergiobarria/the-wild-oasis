<script lang="ts">
	import heroBg from '$lib/assets/bg.webp';
	import placeholder from '$lib/assets/placeholder.jpg';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { BENEFITS } from '$lib/data/benefits';
	import { TESTIMONIALS } from '$lib/data/testimonials';
</script>

<section id="hero" class="relative h-[80dvh]">
	<img src={heroBg} alt="hero" class="absolute inset-0 size-full object-cover" />
	<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/50"></div>

	<div
		class="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform text-center"
	>
		<Typography variant="h1" size="5xl" class="font-medium text-white md:text-7xl">
			Welcome To Paradise
		</Typography>
		<Typography
			variant="body"
			size="lg"
			class="mx-auto max-w-xl text-base text-white/70 md:text-lg"
		>
			Escape to the heart of nature and unwind in our handcrafted luxury cabins — where tranquility,
			comfort, and adventure meet.
		</Typography>

		<Button href="/cabins" size="lg">Explore our luxury cabins</Button>
	</div>
</section>

<section id="benefits" class="mx-auto max-w-6xl space-y-16 px-6 py-16 text-center">
	<div>
		<Typography variant="h2" size="3xl" class="font-bold text-primary">Why Choose Us?</Typography>
		<Typography
			variant="body"
			size="lg"
			class="mx-auto mt-4 max-w-xl text-base text-zinc-400 md:text-lg"
		>
			We offer more than just a stay. Discover a curated experience surrounded by nature, designed
			for those who seek comfort, privacy, and beauty.
		</Typography>
	</div>

	<div class="grid gap-8 text-left md:grid-cols-3">
		{#each BENEFITS as benefit}
			<div
				class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				></div>
				<benefit.icon class="text-primary" />
				<Typography variant="h3" size="lg" class="text-xl font-semibold">
					{benefit.title}
				</Typography>
				<Typography
					variant="body"
					size="lg"
					class="mx-auto mt-4 max-w-xl text-base text-zinc-400 md:text-lg"
				>
					{benefit.description}
				</Typography>
			</div>
		{/each}
	</div>
</section>

<section id="testimonials" class="mx-auto max-w-6xl space-y-16 px-6 py-16 text-center">
	<div class="text-center">
		<Typography variant="h2" size="3xl" class="font-bold text-primary">
			What Our Guests Say
		</Typography>
		<Typography variant="body" size="lg" class="mx-auto mt-4 max-w-xl text-zinc-400 md:text-lg">
			We&apos;re proud to share the stories of our happy guests who&apos;ve experienced the
			tranquility and charm of our cabins.
		</Typography>
	</div>

	<div class="grid gap-8 md:grid-cols-3">
		{#each TESTIMONIALS as testimonial}
			<div
				class="bg-base-100 flex flex-col items-center space-y-4 rounded-2xl p-6 text-center shadow-lg"
			>
				<img
					src={placeholder}
					alt={testimonial.name}
					class="h-20 w-20 rounded-full object-cover shadow-sm ring-2 ring-primary"
				/>

				<Typography variant="body" size="lg" class="text-zinc-4T0 text-sm italic">
					{testimonial.message}
				</Typography>

				<Typography variant="h3" size="lg" class="text-sm font-semibold text-primary">
					{testimonial.name}
				</Typography>
			</div>
		{/each}
	</div>
</section>

<section id="newsletter" class="bg-base-200 px-6 py-12">
	<div class="mx-auto max-w-xl space-y-6 text-center">
		<Typography variant="h2" size="3xl" class="font-bold text-primary">
			Join Our Newsletter
		</Typography>
		<Typography
			variant="body"
			size="lg"
			class="mx-auto mt-4 max-w-xl text-base text-zinc-400 md:text-lg"
		>
			Be the first to know about new cabins, exclusive offers, and travel inspiration.
		</Typography>

		<!-- TODO: implement newsletter form -->
		<div>newsletter form</div>
	</div>
</section>
