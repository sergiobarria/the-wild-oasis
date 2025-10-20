<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	import { type VariantProps, tv } from 'tailwind-variants';

	import { type WithElementRef, cn } from '$lib/utils.js';

	export const typographyVariants = tv({
		base: 'text-foreground transition-colors mb-6',
		variants: {
			variant: {
				display: 'font-extrabold tracking-tight',
				h1: 'font-extrabold tracking-tight',
				h2: 'font-semibold tracking-tight',
				h3: 'font-semibold tracking-tight',
				h4: 'font-semibold tracking-tight',
				h5: 'font-medium tracking-tight',
				h6: 'font-medium tracking-tight',
				body: 'leading-7',
				lead: 'text-muted-foreground font-normal',
				large: 'font-semibold',
				small: 'font-medium leading-none',
				muted: 'text-muted-foreground',
				code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold',
				blockquote: 'border-l-2 pl-6 italic',
				list: 'ml-6 list-disc [&>li]:mt-2'
			},
			size: {
				xs: 'text-xs',
				sm: 'text-sm',
				base: 'text-base',
				lg: 'text-lg',
				xl: 'text-xl',
				'2xl': 'text-2xl',
				'3xl': 'text-3xl',
				'4xl': 'text-4xl',
				'5xl': 'text-5xl',
				'6xl': 'text-6xl'
			},
			responsive: {
				true: 'text-sm sm:text-base md:text-lg lg:text-xl',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'body',
			size: 'base',
			responsive: false
		}
	});

	export type TypographyVariant = VariantProps<typeof typographyVariants>['variant'];
	export type TypographySize = VariantProps<typeof typographyVariants>['size'];
	export type TypographyResponsive = VariantProps<typeof typographyVariants>['responsive'];

	export type TypographyProps = WithElementRef<HTMLAttributes<HTMLElement>> & {
		variant?: TypographyVariant;
		size?: TypographySize;
		responsive?: TypographyResponsive;
		as?: keyof HTMLElementTagNameMap;
	};
</script>

<script lang="ts">
	let {
		class: className,
		variant = 'body',
		size = 'base',
		responsive = false,
		ref = $bindable(null),
		as: Component = 'p',
		children,
		...restProps
	}: TypographyProps = $props();
</script>

<svelte:element
	this={Component}
	bind:this={ref}
	data-slot="typography"
	class={cn(typographyVariants({ variant, size, responsive }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
