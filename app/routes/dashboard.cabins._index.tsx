import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { PlusIcon } from 'lucide-react';

import { CabinsTable } from '~/components/cabins/cabins-table';
import { Button } from '~/components/ui/button';
import { useFlash } from '~/hooks/use-flash';
import { deleteCabin, getCabins } from '~/lib/.services/cabins';
import { FlashMessage, getSession, setFlashMessage } from '~/session';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	const cabins = await getCabins();

	// Check if there is a flash success or error message in the session
	const message: FlashMessage | null = session.get('message');

	return json({ cabins, message });
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const _action = formData.get('_action') as string;
	const cabinID = formData.get('cabinID') as string;

	if (!_action || !cabinID) throw new Response('Bad Request', { status: 400 });

	if (_action === 'delete') {
		const record = await deleteCabin(cabinID);
		const flashMessage = record
			? { type: 'success' as const, message: 'Cabin has been deleted successfully' }
			: { type: 'error' as const, message: 'An error occurred while deleting the cabin. Please try again.' };

		const headers = await setFlashMessage(request, flashMessage);

		return redirect('/dashboard/cabins', { headers });
	}

	throw new Response('Bad Request', { status: 400 });
}

export default function CabinsPage() {
	const { cabins, message } = useLoaderData<typeof loader>();
	const navigate = useNavigate();
	useFlash(message);

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
