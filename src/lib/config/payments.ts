import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

export const PAYMENT_STATUS = {
	PENDING: 'pending',
	PROCESSING: 'processing',
	SUCCEEDED: 'succeeded',
	FAILED: 'failed',
	REFUNDED: 'refunded'
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const STRIPE_CONFIG = {
	currency: 'USD',
	feePercentage: 2.9,
	feeFixed: 0.3,
	publishableKey: PUBLIC_STRIPE_PUBLISHABLE_KEY
} as const;
