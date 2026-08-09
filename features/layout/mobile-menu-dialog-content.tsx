import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/** Shared full-bleed positioning for a `Dialog` used as a mobile nav menu -- used by
 *  `header.tsx`'s primary nav and `guest-area-nav.tsx`'s account nav so the two can't
 *  silently drift out of sync on styling. */
export function MobileMenuDialogContent({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <DialogContent className='top-0 left-0 max-w-full translate-x-0 translate-y-0 rounded-none sm:max-w-full'>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
        </DialogContent>
    );
}
