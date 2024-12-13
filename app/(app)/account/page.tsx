import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Guest Area',
};

export default function AccountPage() {
	const firstName = 'John'; // TODO: Get the user's first name from the session

	return (
		<div>
			<h2 className="mb-7 text-2xl font-semibold text-accent">Welcome, {firstName}</h2>
		</div>
	);
}
