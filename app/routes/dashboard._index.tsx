import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [{ title: 'Home | The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function DashboardIndexPage() {
	return <div>Dashboard Index Page</div>;
}
