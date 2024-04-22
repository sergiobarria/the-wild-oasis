import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { getCabinByID } from '~/lib/.services/cabins';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
	if (!params.id) return redirect('/dashboard/cabins');

	const cabin = await getCabinByID(params.id);

	if (!cabin) throw new Response(null, { status: 404, statusText: 'Not Found' });

	return json({ cabin });
}

export default function CabinDetailPage() {
	const { cabin } = useLoaderData<typeof loader>();
	const navigate = useNavigate();

	return (
		<>
			<div>
				<Button variant="outline" size="icon" className="mb-3" onClick={() => navigate(-1)}>
					<ChevronLeftIcon size={24} />
				</Button>
				<h1 className="text-3xl font-bold underline">Cabin Detail Page</h1>
			</div>
			<p>Cabin Slug: {cabin.id}</p>
		</>
	);
}
