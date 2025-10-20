<script lang="ts">
	import { MailIcon, MapPinIcon, PhoneIcon } from '@lucide/svelte';

	import ContactForm from '$lib/components/contact/contact-form.svelte';
	import Typography from '$lib/components/shared/typography.svelte';
	import { APP_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '$lib/config/app';
</script>

<svelte:head>
	<title>Contact - {APP_NAME}</title>
</svelte:head>

<section id="contact" class="container mx-auto max-w-5xl px-8 py-12">
	<Typography variant="h1" size="4xl" class="text-primary">Get in touch</Typography>

	<div class="space-y-8">
		<Typography variant="body" size="lg">
			We'd love to hear from you! Whether you have questions, want to book a cabin, or just want to
			say hello, our team is here to help. Fill out the form below and we'll get back to you as soon
			as possible.
		</Typography>
	</div>

	<ContactForm />

	<div class="mx-auto mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3">
		<div
			class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			></div>
			<div class="relative flex flex-col items-center text-center">
				<div
					class="mb-5 rounded-full bg-primary/10 p-4 ring-4 ring-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15"
				>
					<MapPinIcon class="size-7 text-primary" />
				</div>
				<Typography variant="h3" size="lg" class="mb-3 font-semibold">Address</Typography>
				<Typography variant="body" size="sm" class="mb-0 leading-relaxed text-muted-foreground">
					The Wild Oasis, Via delle Dolomiti 25
					<br />
					39030 Cortina d'Ampezzo (BZ), Italy
				</Typography>
			</div>
		</div>

		<div
			class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			></div>
			<div class="relative flex flex-col items-center text-center">
				<div
					class="mb-5 rounded-full bg-primary/10 p-4 ring-4 ring-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15"
				>
					<MailIcon class="size-7 text-primary" />
				</div>
				<Typography variant="h3" size="lg" class="mb-3 font-semibold">Email</Typography>
				<Typography
					variant="body"
					size="sm"
					class="mb-0 leading-relaxed break-all text-muted-foreground"
				>
					{CONTACT_EMAIL}
				</Typography>
			</div>
		</div>

		<div
			class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			></div>
			<div class="relative flex flex-col items-center text-center">
				<div
					class="mb-5 rounded-full bg-primary/10 p-4 ring-4 ring-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15"
				>
					<PhoneIcon class="size-7 text-primary" />
				</div>
				<Typography variant="h3" size="lg" class="mb-3 font-semibold">Phone</Typography>
				<Typography variant="body" size="sm" class="mb-0 leading-relaxed text-muted-foreground">
					{CONTACT_PHONE}
				</Typography>
			</div>
		</div>
	</div>
</section>
