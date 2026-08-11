import { AMENITY_ICON_BY_KEY } from '@/lib/amenity-icons';

export function IconsSection() {
    const entries = Object.entries(AMENITY_ICON_BY_KEY);

    return (
        <section id='icons' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Icons</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Lucide throughout (spec §6). Each amenity stores a Lucide icon key resolved
                    through this map -- {entries.length} keys are currently allowed (see{' '}
                    <code className='font-mono text-xs'>lib/amenity-icons.ts</code> and the
                    server-side allow-list in{' '}
                    <code className='font-mono text-xs'>convex/lib/amenities.ts</code>).
                </p>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {entries.map(([key, Icon]) => (
                    <div
                        key={key}
                        className='flex flex-col items-center gap-2 rounded-lg border border-border p-3 text-center'
                    >
                        <Icon className='size-5 text-primary' />
                        <span className='text-xs text-muted-foreground'>{key}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
