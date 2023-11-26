import { MoreHorizontalIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    Button,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    Dialog,
} from '@/components/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin } from '@/services/cabins';

interface TableActionsProps {
    itemId: number;
}

export function CabinsTableActions({ itemId }: TableActionsProps) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: deleteCabin,
        onSuccess: () => {
            toast.success('Cabin deleted successfully!');
            queryClient.invalidateQueries({
                queryKey: ['cabins'],
            });
        },
        onError: err => {
            console.error(err);
            toast.error('Something went wrong while deleting the cabin.');
        },
    });

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="rounded-full p-3">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => alert(itemId)}
                        className="hover:cursor-pointer"
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 hover:cursor-pointer">
                        <DialogTrigger>Delete</DialogTrigger>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        Do you want to delete the entry? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={() => mutate(itemId)}
                        disabled={isPending}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
