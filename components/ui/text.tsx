import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textVariants = cva('text-foreground', {
    variants: {
        variant: {
            body: 'text-base font-normal',
            small: 'text-sm text-muted-foreground',
        },
    },
    defaultVariants: {
        variant: 'body',
    },
});

/**
 * The brand's documented body/small type scale (see `/brand`'s Type
 * section). Renders a `<p>` by default -- pass `render={<span />}` for
 * inline text.
 */
function Text({
    className,
    variant = 'body',
    render,
    ...props
}: useRender.ComponentProps<'p'> & VariantProps<typeof textVariants>) {
    return useRender({
        defaultTagName: 'p',
        props: mergeProps<'p'>(
            {
                className: cn(textVariants({ variant }), className),
            },
            props,
        ),
        render,
        state: {
            slot: 'text',
            variant,
        },
    });
}

export { Text, textVariants };
