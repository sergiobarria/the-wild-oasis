import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

const HEADING_ROWS = [
    { sample: 'Disappear for a while.', level: 1 as const, label: 'H1 -- marketing display' },
    { sample: 'Built for slowing down', level: 2 as const, label: 'H2 -- section heading' },
    { sample: 'Featured amenities', level: 3 as const, label: 'H3 -- subsection heading' },
    { sample: 'Reservation status', level: 4 as const, label: 'H4 -- admin/UI heading' },
];

const TEXT_ROWS = [
    {
        sample: 'Private cabins surrounded by woods, designed for slower days and quieter nights.',
        variant: 'body' as const,
        label: 'Body',
    },
    {
        sample: 'Checked in Aug 8 · 2 guests · Confirmed',
        variant: 'small' as const,
        label: 'Small / muted',
    },
];

export function TypeScaleSection() {
    return (
        <section id='type' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Type</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Josefin Sans throughout (spec §14) -- lighter weights for marketing display,
                    heavier for anything read at speed. No separate body typeface: hierarchy comes
                    from weight and size, not a second family. Monospace is the utility voice for
                    token values, code, and data (used throughout this page). Every row below
                    renders through{' '}
                    <code className='font-mono text-xs'>components/ui/heading.tsx</code> and{' '}
                    <code className='font-mono text-xs'>components/ui/text.tsx</code> -- this
                    section is their live reference, not a parallel copy of the scale.
                </p>
            </div>
            <div className='divide-y divide-border rounded-xl border border-border'>
                {HEADING_ROWS.map((row) => (
                    <div
                        key={row.label}
                        className='grid gap-1 p-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-4'
                    >
                        <Heading level={row.level}>{row.sample}</Heading>
                        <p className='font-mono text-xs text-muted-foreground'>
                            {row.label} · {`<Heading level={${row.level}}>`}
                        </p>
                    </div>
                ))}
                {TEXT_ROWS.map((row) => (
                    <div
                        key={row.label}
                        className='grid gap-1 p-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-4'
                    >
                        <Text variant={row.variant}>{row.sample}</Text>
                        <p className='font-mono text-xs text-muted-foreground'>
                            {row.label} ·{' '}
                            {row.variant === 'body' ? '<Text>' : `<Text variant="${row.variant}">`}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
