import { MapPin, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function CardsSection() {
    return (
        <section id='cards' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Cards & elevation</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Elevation comes from the card token being one step lighter than the background,
                    plus a subtle border -- not a shadow (spec §15 rules out heavy shadows and
                    glassmorphism outright).
                </p>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <Card>
                    <CardHeader>
                        <CardTitle>Blackwood</CardTitle>
                        <CardDescription className='flex items-center gap-1'>
                            <MapPin className='size-3.5' /> Cascade foothills
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <Users className='size-3.5' /> Sleeps 4 · 2 bedrooms
                    </CardContent>
                    <CardFooter className='justify-between'>
                        <span className='font-medium'>$240 / night</span>
                        <Badge>Available</Badge>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Hidden Creek</CardTitle>
                        <CardDescription className='flex items-center gap-1'>
                            <MapPin className='size-3.5' /> Willow Valley
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <Users className='size-3.5' /> Sleeps 2 · 1 bedroom
                    </CardContent>
                    <CardFooter className='justify-between'>
                        <span className='font-medium'>$180 / night</span>
                        <Badge variant='secondary'>Booked</Badge>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pine Ridge</CardTitle>
                        <CardDescription className='flex items-center gap-1'>
                            <MapPin className='size-3.5' /> Dolomite range
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <Users className='size-3.5' /> Sleeps 6 · 3 bedrooms
                    </CardContent>
                    <CardFooter className='justify-between'>
                        <span className='font-medium'>$310 / night</span>
                        <Badge variant='destructive'>Maintenance</Badge>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
