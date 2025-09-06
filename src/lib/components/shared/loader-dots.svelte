<script lang="ts">
	let { label }: { label: string } = $props();
</script>

<div class="flex flex-col items-center justify-center space-y-4 py-12">
	<div class="flex space-x-1">
		<div class="h-3 w-3 animate-bounce rounded-full bg-primary"></div>
		<div
			class="h-3 w-3 animate-bounce rounded-full bg-primary"
			style="animation-delay: 0.1s"
		></div>
		<div
			class="h-3 w-3 animate-bounce rounded-full bg-primary"
			style="animation-delay: 0.2s"
		></div>
	</div>
	<p class="animate-pulse text-sm text-muted-foreground">{label}</p>
</div>
