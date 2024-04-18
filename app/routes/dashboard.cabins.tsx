import type { MetaFunction } from '@remix-run/node';
import { Outlet, useNavigate, useRouteError } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function CabinsPageLayout() {
	return <Outlet />;
}

export function ErrorBoundary() {
	const error = useRouteError();
	const navigate = useNavigate();

	console.error('💥 ~ ErrorBoundary ~ error:', error);

	return (
		<div className="mx-auto flex h-full max-w-[50%] flex-col items-center justify-center space-y-6 text-center">
			<h1 className="text-3xl font-bold underline">Cabin Not Found</h1>
			<p>We couldn&apos;t find the cabin you were looking for. Please try again or go back to the cabins page.</p>
			<Button onClick={() => navigate('/dashboard/cabins')}>Go Back</Button>
		</div>
	);
}
