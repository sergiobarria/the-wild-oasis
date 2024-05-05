import { redirect } from 'next/navigation';

export default function Home() {
	// Temporary redirect to /dashboard until we have a login page here
	redirect('/dashboard');

	return <></>;
}
