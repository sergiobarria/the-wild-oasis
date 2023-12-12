export function formatCurrency(value: number | null) {
	if (!value) return '$0.00';

	return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(value);
}
