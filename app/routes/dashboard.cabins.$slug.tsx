import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getCabinBySlug } from '~/lib/.services/cabins';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export async function loader({ params }: LoaderFunctionArgs) {
	if (!params.slug) return redirect('/dashboard/cabins');
	// if (!params.slug)
	// 	throw new Response(null, {
	// 		status: 404,
	// 		statusText: 'Not Found',
	// 	});

	const cabin = await getCabinBySlug(params.slug);

	if (!cabin) throw new Error('Cabin not found');

	return json(cabin);
}

export default function CabinDetailPage() {
	const cabin = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className="text-3xl font-bold underline">Cabin Detail Page</h1>
			<p>Cabin Slug: {cabin.slug}</p>
		</>
	);
}
