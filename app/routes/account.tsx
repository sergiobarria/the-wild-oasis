import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [{ title: 'Account | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function AccountPage() {
	return <h1 className="text-3xl font-bold underline">Account Page</h1>;
}
