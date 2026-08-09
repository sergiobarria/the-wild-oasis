import { CabinFilters } from './components/cabin-filters';
import { CabinsResults } from './components/cabins-results';

export function CabinsScreen() {
    return (
        <div className='mx-auto w-full max-w-6xl space-y-8 px-6 py-12 lg:px-8'>
            <div className='space-y-2'>
                <h1 className='font-heading text-3xl font-medium'>Cabins</h1>
                <p className='text-muted-foreground'>
                    Browse the full collection and narrow it down to what fits your stay.
                </p>
            </div>

            <CabinFilters />
            <CabinsResults />
        </div>
    );
}
