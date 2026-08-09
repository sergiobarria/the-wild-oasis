import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes';

export function HeroSection() {
    return (
        <section className='relative flex min-h-[640px] items-end overflow-hidden pb-32 lg:min-h-[760px]'>
            <Image
                src='/assets/bg.webp'
                alt=''
                fill
                priority
                sizes='100vw'
                className='object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10' />

            <div className='relative mx-auto w-full max-w-6xl px-6 lg:px-8'>
                <div className='max-w-xl space-y-6'>
                    <h1 className='font-heading text-4xl font-medium text-balance sm:text-5xl lg:text-6xl'>
                        Disappear for a while.
                    </h1>
                    <p className='max-w-md text-lg text-muted-foreground'>
                        Private cabins surrounded by woods, designed for slower days and quieter
                        nights.
                    </p>
                    <Button
                        render={<Link href={APP_ROUTES.CABINS} />}
                        nativeButton={false}
                        size='lg'
                    >
                        Explore Cabins
                    </Button>
                </div>
            </div>
        </section>
    );
}
