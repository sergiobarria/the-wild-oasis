import { getCabins } from '@/database/data-access/cabins';

export default async function CabinsPage() {
	const cabins = await getCabins();

	return (
		<div>
			<h1 className="text-2xl font-bold">Cabins</h1>

			<pre>{JSON.stringify(cabins, null, 2)}</pre>
		</div>
	);
}
