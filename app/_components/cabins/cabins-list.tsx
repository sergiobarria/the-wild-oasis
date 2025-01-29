'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';

export function CabinsList() {
	const cabins = useQuery(api.cabins.getAll);

	return <pre>{JSON.stringify(cabins, null, 2)}</pre>;
}
