import type { ReactNode } from 'react';

import { Button } from 'react-email';

/**
 * Near-black label on the gold fill, never white -- same contrast rule as
 * the app's button component (see app/globals.css and /brand): white on the
 * brand gold measures ~2.2:1, near-black measures ~8.5:1.
 */
export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Button
            href={href}
            className='box-border block rounded-md bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground no-underline'
        >
            {children}
        </Button>
    );
}
