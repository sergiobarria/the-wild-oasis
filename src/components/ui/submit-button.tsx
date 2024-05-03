'use client';

import { useFormStatus } from 'react-dom';
import { Loader2Icon, SaveIcon } from 'lucide-react';

import { Button } from './button';
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
	className?: string;
};

export function SubmitButton({ className }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending} aria-disabled={pending} className={cn(className)}>
			{pending ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : <SaveIcon className="mr-2 size-4" />}
			{pending ? 'Saving...' : 'Save Cabin'}
		</Button>
	);
}
