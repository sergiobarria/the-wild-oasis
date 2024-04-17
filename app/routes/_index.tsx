import type { MetaFunction } from '@remix-run/node';

import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
	return [{ title: 'The Wild Oasis' }, { name: 'description', content: 'Hotel Management System' }];
};

export default function Index() {
	function handleClick() {
		console.log('clicked');
	}

	return (
		<h1 className="text-3xl font-bold underline">
			Hello world!
			<Button onClick={handleClick}>click me</Button>
		</h1>
	);
}
