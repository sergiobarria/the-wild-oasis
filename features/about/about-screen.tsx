import Image from 'next/image';
import Link from 'next/link';

import { Leaf, MapPin, Sprout } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes';
import { SITE_CONFIG } from '@/lib/site-config';

const PHILOSOPHY_POINTS = [
    {
        icon: MapPin,
        title: 'Handpicked, not mass-listed',
        description:
            'Every cabin is visited and chosen by us before it ever appears on the site -- no automated listing pipeline, no filler.',
    },
    {
        icon: Leaf,
        title: 'Built around quiet',
        description:
            'We favor cabins set back from the road and wrapped in trees over ones that are merely close to attractions.',
    },
    {
        icon: Sprout,
        title: 'Light on the land',
        description:
            'We work with hosts who maintain their properties and surrounding land responsibly, not ones who just rent them out.',
    },
] as const;

export function AboutScreen({ galleryImageUrls }: { galleryImageUrls: string[] }) {
    return (
        <div className='space-y-20 pb-20'>
            <section className='mx-auto w-full max-w-3xl px-6 pt-16 text-center lg:px-8'>
                <h1 className='font-heading text-4xl font-medium text-balance sm:text-5xl'>
                    About {SITE_CONFIG.NAME}
                </h1>
                <p className='mt-6 text-lg text-balance text-muted-foreground'>
                    {SITE_CONFIG.TAGLINE}
                </p>
            </section>

            <section className='mx-auto w-full max-w-3xl space-y-4 px-6 lg:px-8'>
                <h2 className='font-heading text-2xl font-medium'>Our story</h2>
                <p className='text-muted-foreground'>
                    {SITE_CONFIG.NAME} started from a simple frustration: most cabin listings look
                    identical, and most of them aren&apos;t actually remote. We wanted a smaller,
                    more deliberate catalog -- cabins we&apos;d book ourselves, in places quiet
                    enough that the trip itself starts the moment you arrive.
                </p>
                <p className='text-muted-foreground'>
                    What began as a short list of favorite properties has grown into a curated
                    collection, but the standard hasn&apos;t changed: every cabin still has to earn
                    its place.
                </p>
            </section>

            <section className='mx-auto w-full max-w-6xl px-6 lg:px-8'>
                <div className='mx-auto max-w-2xl space-y-2 text-center'>
                    <h2 className='font-heading text-2xl font-medium'>Our philosophy</h2>
                </div>

                <div className='mt-10 grid gap-8 sm:grid-cols-3'>
                    {PHILOSOPHY_POINTS.map(({ icon: Icon, title, description }) => (
                        <div key={title} className='space-y-3 text-center'>
                            <Icon className='mx-auto size-6 text-primary' aria-hidden='true' />
                            <h3 className='font-heading text-base font-medium'>{title}</h3>
                            <p className='text-sm text-muted-foreground'>{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className='mx-auto w-full max-w-3xl space-y-4 px-6 lg:px-8'>
                <h2 className='font-heading text-2xl font-medium'>The cabin experience</h2>
                <p className='text-muted-foreground'>
                    Booking with us looks the same as booking anywhere else -- pick your dates,
                    reserve, show up. What&apos;s different is what&apos;s waiting for you: a space
                    that&apos;s been lived in and cared for, not staged for photos and left empty
                    between guests. A fire that&apos;s ready to light, a kitchen stocked enough to
                    cook a real meal, and enough distance from the next cabin that you forget other
                    guests exist at all.
                </p>
            </section>

            <section className='mx-auto w-full max-w-3xl space-y-4 px-6 lg:px-8'>
                <h2 className='font-heading text-2xl font-medium'>Sustainability, not a slogan</h2>
                <p className='text-muted-foreground'>
                    We&apos;re a small operation, not a certification body, and we&apos;re not going
                    to claim eco-credentials we haven&apos;t earned. What we can say honestly: we
                    favor hosts who maintain their land rather than clear it, who fix things instead
                    of replacing them, and who treat a cabin as a place to return to rather than a
                    short-term asset to flip.
                </p>
            </section>

            {galleryImageUrls.length > 0 && (
                <section className='mx-auto w-full max-w-6xl px-6 lg:px-8'>
                    <div className='mx-auto max-w-2xl space-y-2 text-center'>
                        <h2 className='font-heading text-2xl font-medium'>A few of our cabins</h2>
                    </div>

                    <div className='mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3'>
                        {galleryImageUrls.map((url, index) => (
                            <div
                                key={url}
                                className='relative aspect-4/3 overflow-hidden rounded-xl'
                            >
                                <Image
                                    src={url}
                                    alt=''
                                    fill
                                    className='object-cover'
                                    sizes='(min-width: 640px) 33vw, 50vw'
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className='mx-auto w-full max-w-3xl px-6 text-center lg:px-8'>
                <h2 className='font-heading text-2xl font-medium'>See it for yourself</h2>
                <p className='mt-3 text-muted-foreground'>
                    Every cabin on {SITE_CONFIG.NAME} is one we&apos;d happily book ourselves.
                </p>
                <Button
                    render={<Link href={APP_ROUTES.CABINS} />}
                    nativeButton={false}
                    className='mt-6'
                >
                    Explore cabins
                </Button>
            </section>
        </div>
    );
}
