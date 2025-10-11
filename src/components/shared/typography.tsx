import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typographyVariants = cva('text-foreground transition-colors mb-6', {
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
            list: 'ml-6 list-disc [&>li]:mt-2',
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
            '6xl': 'text-6xl',
        },
        responsive: {
            true: 'text-sm sm:text-base md:text-lg lg:text-xl',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'body',
        size: 'base',
        responsive: false,
    },
})

interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
    asChild?: boolean
    as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, size, responsive, asChild = false, as: Component = 'p', ...props }, ref) => {
        const Comp = asChild ? Slot : Component

        return (
            <Comp ref={ref} className={cn(typographyVariants({ variant, size, responsive, className }))} {...props} />
        )
    },
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants }
