import { redirect, type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [{ title: 'The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export async function loader() {
	// NOTE: For now we are redirecting to the dashboard page
	return redirect('/dashboard');
}

export default function Index() {
	return <></>;
}
