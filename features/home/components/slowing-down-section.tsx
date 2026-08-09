import { Coffee, DoorOpen, Flame, Leaf } from 'lucide-react';

import { AMENITY_ICON_MAP } from '@/lib/amenity-icons';

const CONCEPTS = [
    {
        icon: DoorOpen,
        title: 'Privacy',
        description: 'Your own way in, no shared halls or driveways.',
    },
    {
        icon: Leaf,
        title: 'Nature',
        description: 'Surrounded by forest, not neighbors.',
    },
    {
        icon: Flame,
        title: 'Comfort',
        description: 'Fireplaces, soft linens, heating that actually works.',
    },
    {
        icon: Coffee,
        title: 'Thoughtful amenities',
        description: 'Coffee in the morning, a hot tub after dark.',
    },
] as const;

const FEATURED_AMENITIES = ['WiFi', 'Kitchen', 'Fireplace', 'Hot Tub', 'Garden', 'Grill / BBQ'];

export function SlowingDownSection() {
    return (
        <section className='mx-auto max-w-6xl px-6 py-16 lg:px-8'>
            <div className='mx-auto max-w-2xl space-y-2 text-center'>
                <h2 className='font-heading text-3xl font-medium text-balance sm:text-4xl'>
                    Built for slowing down
                </h2>
            </div>

            <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
                {CONCEPTS.map(({ icon: Icon, title, description }) => (
                    <div key={title} className='space-y-3 text-center'>
                        <Icon className='mx-auto size-6 text-primary' />
                        <h3 className='font-heading text-base font-medium'>{title}</h3>
                        <p className='text-sm text-muted-foreground'>{description}</p>
                    </div>
                ))}
            </div>

            <div className='mt-16 flex flex-wrap justify-center gap-3'>
                {FEATURED_AMENITIES.map((name) => {
                    const Icon = AMENITY_ICON_MAP[name];

                    return (
                        <span
                            key={name}
                            className='flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground'
                        >
                            {Icon && <Icon className='size-4 text-primary' />}
                            {name}
                        </span>
                    );
                })}
            </div>
        </section>
    );
}
