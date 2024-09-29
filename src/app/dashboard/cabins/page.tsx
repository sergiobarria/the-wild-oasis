import { Suspense } from 'react';

import { CabinsTable } from './_components/cabins-table';

export default async function CabinsPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Cabins</h1>

			<div>
				<Suspense fallback={<div>Loading...</div>}>
					<CabinsTable />
				</Suspense>
			</div>
		</div>
	);
}
