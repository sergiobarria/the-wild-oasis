<script>
	let result = $state();
	let loading = $state(false);

	$inspect(result);

	const handleClick = async () => {
		loading = true;
		result = undefined;

		try {
			const response = await fetch('/api/jobs', { method: 'POST' }); // Ruta correcta

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const reader = response.body?.getReader();
			if (!reader) throw new Error('No reader available');

			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\n').filter((line) => line.trim());

				for (const line of lines) {
					try {
						result = JSON.parse(line);
					} catch (e) {
						console.warn('Could not parse:', line);
					}
				}
			}

			setTimeout(() => {
				result = undefined;
				loading = false;
			}, 3000);
		} catch (error) {
			console.error('💥 ERROR: ', error);
			loading = false;
		}
	};
</script>

{#if loading && result?.progress !== undefined}
	<label>
		{result.progress === 100 ? 'Done' : 'Processing...'}
		<progress value={result.progress} max="100"></progress>
		{result.progress}%
	</label>
{:else if result?.error}
	<div class="error">{result.error}</div>
{:else if result?.data}
	<div class="success">{result.data}</div>
{:else}
	<button onclick={handleClick} disabled={loading}>
		{loading ? 'Processing...' : 'Schedule Background Job'}
	</button>
{/if}
