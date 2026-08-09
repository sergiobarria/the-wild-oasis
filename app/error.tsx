'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { APP_ROUTES } from '@/lib/routes';

/**
 * Route-segment error boundary (app/api-reference/file-conventions/error) --
 * catches uncaught exceptions anywhere below the root layout. Client
 * Component errors carry their real message; Server Component errors are
 * genericized by Next.js and identifiable via `error.digest` against server
 * logs, so that digest is the only error detail shown here.
 */
export default function ErrorPage({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className='flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center'>
            <Heading level={2}>Something went wrong</Heading>
            <Text className='max-w-md'>
                An unexpected error occurred. Try again, or head back home if it keeps happening.
            </Text>
            {error.digest && <Text variant='small'>Reference: {error.digest}</Text>}
            <div className='mt-2 flex gap-2'>
                <Button onClick={() => retry()}>Try again</Button>
                <Button
                    render={<Link href={APP_ROUTES.HOME} />}
                    nativeButton={false}
                    variant='outline'
                >
                    Back home
                </Button>
            </div>
        </div>
    );
}
