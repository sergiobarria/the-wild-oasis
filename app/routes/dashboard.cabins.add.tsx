import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [{ title: 'Create Cabin | The Wild Oasis' }];
};

export default function CreateCabinPage() {
	return <div>Create New Cabin</div>;
}
