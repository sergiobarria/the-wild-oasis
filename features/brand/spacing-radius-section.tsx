import { RADIUS_SCALE } from '@/features/brand/token-data';

export function SpacingRadiusSection() {
    return (
        <section id='spacing' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Spacing & radius</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Base radius <code className='font-mono text-xs'>0.625rem</code> (spec §15).
                    Every step below derives from that one value -- change it once, the whole scale
                    moves with it.
                </p>
            </div>
            <div className='flex flex-wrap items-end gap-6'>
                {RADIUS_SCALE.map((step) => (
                    <div key={step.name} className='flex flex-col items-center gap-2'>
                        <div
                            className={`size-16 border-2 border-primary bg-primary/10 ${step.className}`}
                        />
                        <p className='font-mono text-xs text-muted-foreground'>{step.name}</p>
                    </div>
                ))}
            </div>
            <p className='max-w-2xl text-sm text-muted-foreground'>
                Generous spacing on marketing surfaces, tighter and denser in admin tables --
                moderately rounded corners throughout, subtle elevation only. No heavy shadows,
                gradients, glassmorphism, or pill-shaped controls (spec §15).
            </p>
        </section>
    );
}
