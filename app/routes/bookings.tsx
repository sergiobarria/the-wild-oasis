import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [{ title: 'Cabins | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function BookingsPage() {
	return <h1 className="text-3xl font-bold underline">Bookings Page</h1>;
}
