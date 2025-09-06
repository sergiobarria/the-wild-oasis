<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		label: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
	}

	let { label, size = 'md' }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center space-y-4 py-12">
	<div class="relative">
		<div
			class={cn('animate-spin rounded-full border-4 border-gray-200 border-t-primary', {
				'size-8': size === 'sm',
				'size-16': size === 'md',
				'size-24': size === 'lg',
				'size-32': size === 'xl'
			})}
		></div>
	</div>
	<p class="text-sm text-muted-foreground">{label}</p>
</div>
