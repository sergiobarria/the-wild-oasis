import {
    ChefHat,
    Coffee,
    DoorOpen,
    Flame,
    FlameKindling,
    Leaf,
    Sparkles,
    Wifi,
} from 'lucide-react';

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

/** Same 6 amenities as `lib/amenity-icons.ts`'s `CURATED_AMENITY_NAMES` -- paired with
 *  their icon directly here (like `CONCEPTS` above) since this is a fixed, decorative
 *  chip row, not a live-DB amenity list. */
const CURATED_AMENITIES = [
    { name: 'WiFi', icon: Wifi },
    { name: 'Kitchen', icon: ChefHat },
    { name: 'Fireplace', icon: Flame },
    { name: 'Hot Tub', icon: Sparkles },
    { name: 'Garden', icon: Leaf },
    { name: 'Grill / BBQ', icon: FlameKindling },
] as const;

export function SlowingDownSection() {
    return (
        <section className='mx-auto w-full max-w-6xl px-6 py-16 lg:px-8'>
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
                {CURATED_AMENITIES.map(({ name, icon: Icon }) => (
                    <span
                        key={name}
                        className='flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground'
                    >
                        <Icon className='size-4 text-primary' />
                        {name}
                    </span>
                ))}
            </div>
        </section>
    );
}
