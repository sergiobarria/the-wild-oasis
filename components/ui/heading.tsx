import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const HEADING_TAGS = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const;

const headingVariants = cva('font-heading text-foreground', {
    variants: {
        level: {
            1: 'text-5xl font-light tracking-tight',
            2: 'text-3xl font-normal tracking-tight',
            3: 'text-xl font-medium',
            4: 'text-base font-medium',
        },
    },
    defaultVariants: {
        level: 1,
    },
});

/**
 * The brand's documented type scale (see `/brand`'s Type section): H1
 * marketing display down to H4 admin/UI headings. `level` sets both the
 * visual size and, by default, the semantic tag -- pass `render` to keep a
 * page's heading hierarchy correct while using a different visual size
 * (e.g. an `<h2>` styled as H1).
 */
function Heading({
    className,
    level = 1,
    render,
    ...props
}: useRender.ComponentProps<'h1'> & VariantProps<typeof headingVariants>) {
    return useRender({
        defaultTagName: HEADING_TAGS[level ?? 1],
        props: mergeProps<'h1'>(
            {
                className: cn(headingVariants({ level }), className),
            },
            props,
        ),
        render,
        state: {
            slot: 'heading',
            level,
        },
    });
}

export { Heading, headingVariants };
