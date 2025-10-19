<script lang="ts">
	import aboutOne from '$lib/assets/about-1.webp';
	import aboutTwo from '$lib/assets/about-2.webp';
	import Typography from '$lib/components/shared/typography.svelte';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/app';
</script>

<svelte:head>
	<title>About - {APP_NAME}</title>
</svelte:head>

<section class="container mx-auto max-w-7xl px-8 py-12">
	<div class="grid grid-cols-5 items-center gap-x-24 gap-y-32 text-lg">
		<div class="col-span-3">
			<Typography variant="h1" size="4xl" class="text-primary">
				Welcome to The Wild Oasis
			</Typography>

			<div class="space-y-8">
				<Typography variant="body" size="lg">
					Where nature's beauty and comfortable living blend seamlessly. Hidden away in the heart of
					the Italian Dolomites, this is your paradise away from home. But it's not just about the
					luxury cabins. It's about the experience of reconnecting with nature and enjoying simple
					pleasures with family.
				</Typography>
				<Typography variant="body" size="lg">
					Our 8 luxury cabins provide a cozy base, but the real freedom and peace you'll find in the
					surrounding mountains. Wander through lush forests, breathe in the fresh air, and watch
					the stars twinkle above from the warmth of a campfire or your hot oub.
				</Typography>
				<Typography variant="body" size="lg">
					This is where memorable moments are made, surrounded by nature's splendor. It's a place to
					slow down, relax, and feel the joy of being together in a beautiful setting.
				</Typography>
			</div>
		</div>

		<div class="col-span-2">
			<img src={aboutOne} alt="Family sitting around a fire pit in front of cabin" />
		</div>

		<div class="col-span-2">
			<img src={aboutTwo} alt="Family that manages The Wild Oasis" />
		</div>

		<div class="col-span-3">
			<Typography variant="h1" size="4xl" class="text-primary">
				Managed by our family since 1962
			</Typography>

			<div class="space-y-8">
				<Typography variant="body" size="lg">
					Since 1962, The Wild Oasis has been a cherished family-run retreat. Started by our
					grandparents, this haven has been nurtured with love and care, passing down through our
					family as a testament to our dedication to creating a warm, welcoming envirTnment.
				</Typography>
				<Typography variant="body" size="lg">
					Over the years, we've maintained the essence of The Wild Oasis, blending the timeless
					beauty of the mountains with the personal touch only a family business can offer. Here,
					you're not just a guest; you're part of our extended family. So join us at The Wild Oasis
					soon, where tradition meets tranquility, and every visit is like coming home.
				</Typography>

				<div>
					<Button href="/cabins">Explore our luxury cabins</Button>
				</div>
			</div>
		</div>
	</div>
</section>
