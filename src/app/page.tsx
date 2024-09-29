import Link from 'next/link';

import { ModeToggle } from '@/components/site/mode-toggle';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<div>
			hellooowwww
			<ModeToggle />
			<Button asChild>
				<Link href="/dashboard">Go to Dashboard</Link>
			</Button>
		</div>
	);
}
