import { useEffect } from 'react';
import { useToast } from './use-toast';

export function useShowToast(toastData: { id: string; title?: string; description: string } | null) {
	const { toast } = useToast();

	useEffect(() => {
		if (!toastData) return;

		toast({
			title: toastData.title,
			description: toastData.description
		});
	}, [toastData, toast]);
}
