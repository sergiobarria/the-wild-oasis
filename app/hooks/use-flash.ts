import { useEffect } from 'react';

import { useToast } from '~/hooks/use-toast';
import { FlashMessage } from '~/session';

export function useFlash(message: FlashMessage | null) {
	const { toast } = useToast();

	useEffect(() => {
		if (!message) return;

		toast({
			title: message.type === 'success' ? 'Success!' : 'Oops! Something went wrong.',
			description: message.message,
			variant: message.type === 'error' ? 'destructive' : undefined,
		});
	}, [message, toast]);
}
