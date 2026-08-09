'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function MotionSection() {
    return (
        <section id='motion' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Motion</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    150-300ms, used to communicate state -- dialogs, dropdowns, toasts, hover (spec
                    §16). Motion never delays an important action. Try each control below.
                </p>
            </div>
            <div className='flex flex-wrap gap-3'>
                <Dialog>
                    <DialogTrigger render={<Button variant='outline' />}>Open dialog</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cancel reservation?</DialogTitle>
                            <DialogDescription>
                                This cancels the stay at Blackwood, Aug 14-17. This can&apos;t be
                                undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant='outline'>Keep reservation</Button>
                            <Button variant='destructive'>Cancel reservation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant='outline' />}>
                        Open dropdown
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>View reservation</DropdownMenuItem>
                        <DropdownMenuItem>Message guest</DropdownMenuItem>
                        <DropdownMenuItem variant='destructive'>
                            Cancel reservation
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger render={<Button variant='outline' />}>
                            Hover for tooltip
                        </TooltipTrigger>
                        <TooltipContent>Payment status: not required (demo mode)</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button
                    variant='outline'
                    onClick={() =>
                        toast.success('Reservation confirmed', {
                            description: 'Blackwood · Aug 14-17 · 2 guests',
                        })
                    }
                >
                    Trigger toast
                </Button>
            </div>
        </section>
    );
}
