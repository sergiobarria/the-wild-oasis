const SCALE = [
    {
        sample: 'Disappear for a while.',
        className: 'text-5xl font-light tracking-tight',
        label: 'H1 -- marketing display',
        classes: 'text-5xl font-light tracking-tight',
    },
    {
        sample: 'Built for slowing down',
        className: 'text-3xl font-normal tracking-tight',
        label: 'H2 -- section heading',
        classes: 'text-3xl font-normal tracking-tight',
    },
    {
        sample: 'Featured amenities',
        className: 'text-xl font-medium',
        label: 'H3 -- subsection heading',
        classes: 'text-xl font-medium',
    },
    {
        sample: 'Reservation status',
        className: 'text-base font-medium',
        label: 'H4 -- admin/UI heading',
        classes: 'text-base font-medium',
    },
    {
        sample: 'Private cabins surrounded by woods, designed for slower days and quieter nights.',
        className: 'text-base font-normal',
        label: 'Body',
        classes: 'text-base font-normal',
    },
    {
        sample: 'Checked in Aug 8 · 2 guests · Confirmed',
        className: 'text-sm text-muted-foreground',
        label: 'Small / muted',
        classes: 'text-sm text-muted-foreground',
    },
] as const;

export function TypeScaleSection() {
    return (
        <section id='type' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Type</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Josefin Sans throughout (spec §14) -- lighter weights for marketing display,
                    heavier for anything read at speed. No separate body typeface: hierarchy comes
                    from weight and size, not a second family. Monospace is the utility voice for
                    token values, code, and data (used throughout this page).
                </p>
            </div>
            <div className='divide-y divide-border rounded-xl border border-border'>
                {SCALE.map((row) => (
                    <div
                        key={row.label}
                        className='grid gap-1 p-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-4'
                    >
                        <p className={row.className}>{row.sample}</p>
                        <p className='font-mono text-xs text-muted-foreground'>
                            {row.label} · {row.classes}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
