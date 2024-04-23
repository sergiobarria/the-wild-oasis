import { redirect, type MetaFunction } from '@remix-run/node';

import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Hotel Booking System' },
		{ name: 'description', content: 'Bookings Management platform for the Wild Oasis Hotel' }
	];
};

export function loader() {
	return redirect('/dashboard');
}

export default function Index() {
	return (
		<>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<Button onClick={() => alert('you clicked me!')}>Click Me</Button>
		</>
	);
}
