import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [{ title: 'The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function SettingsPage() {
	return <h1 className="text-3xl font-bold underline">Settings Page</h1>;
}
