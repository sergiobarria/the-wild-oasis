import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Hotel Booking System' },
		{ name: 'description', content: 'Bookings Management platform for the Wild Oasis Hotel' }
	];
};

export default function Index() {
	return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}
