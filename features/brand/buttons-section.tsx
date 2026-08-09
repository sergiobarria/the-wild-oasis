import { Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['sm', 'default', 'lg'] as const;

export function ButtonsSection() {
    return (
        <section id='buttons' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Buttons</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    <code className='font-mono text-xs'>default</code> is the only variant with a
                    solid fill -- gold background, near-black label (spec §13, primary buttons are
                    the first named use of the accent). Everything else stays quiet:{' '}
                    <code className='font-mono text-xs'>destructive</code> uses a soft tint, never a
                    solid red block -- see the Color section for why.
                </p>
            </div>

            <div className='space-y-4'>
                {SIZES.map((size) => (
                    <div key={size} className='flex flex-wrap items-center gap-3'>
                        <span className='w-14 font-mono text-xs text-muted-foreground'>{size}</span>
                        {VARIANTS.map((variant) => (
                            <Button key={variant} variant={variant} size={size}>
                                {variant === 'link' ? 'Learn more' : 'Confirm reservation'}
                            </Button>
                        ))}
                    </div>
                ))}
            </div>

            <div className='flex flex-wrap items-center gap-3'>
                <span className='w-14 font-mono text-xs text-muted-foreground'>state</span>
                <Button disabled>Confirm reservation</Button>
                <Button disabled>
                    <Loader2 className='animate-spin' />
                    Confirming
                </Button>
                <Button variant='outline' size='icon' aria-label='Add cabin'>
                    <Plus />
                </Button>
            </div>
        </section>
    );
}
