import { ActionFunctionArgs, json, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

import { CabinsTable } from '~/components/cabins/cabins-table';
import { deleteCabin, getCabins } from '~/lib/.services/cabins';
import { Button } from '~/components/ui/button';
import { PlusIcon } from 'lucide-react';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export async function loader() {
	const cabins = await getCabins();

	return json(cabins);
}

export async function action({ request }: ActionFunctionArgs) {
	let success: boolean = false;
	const formData = await request.formData();
	const { _action, ...values } = Object.fromEntries(formData);

	if (!_action) return json({ success, message: 'No Action provided' });

	if (_action === 'delete') {
		const deletedCabinID = await deleteCabin(Number(values.cabinID));
		if (deletedCabinID) success = true;
	}

	return json({ success });
}

export default function CabinsPage() {
	const cabins = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	return (
		<>
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-semibold md:text-4xl">All Cabins</h1>
				<div className="flex items-center gap-8">
					<div>Filter / Sort</div>
					<Button onClick={() => navigate('/dashboard/cabins/add')}>
						<PlusIcon size={20} className="mr-2" />
						Add Cabin
					</Button>
				</div>
			</div>
			<CabinsTable data={cabins} />
		</>
	);
}
