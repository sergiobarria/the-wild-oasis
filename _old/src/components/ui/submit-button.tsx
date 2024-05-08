'use client';

import { useFormStatus } from 'react-dom';
import { Loader2Icon, SaveIcon } from 'lucide-react';

import { Button } from './button';
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
	mode?: 'create' | 'update';
	className?: string;
};

export function SubmitButton({ className, mode = 'create' }: SubmitButtonProps) {
	const { pending } = useFormStatus();
	const buttonLabel = mode === 'create' ? 'Save Cabin' : 'Update Cabin';
	const buttonPendingLabel = mode === 'create' ? 'Creating...' : 'Updating...';

	return (
		<Button type="submit" disabled={pending} aria-disabled={pending} className={cn(className)}>
			{pending ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : <SaveIcon className="mr-2 size-4" />}
			{pending ? buttonPendingLabel : buttonLabel}
		</Button>
	);
}
