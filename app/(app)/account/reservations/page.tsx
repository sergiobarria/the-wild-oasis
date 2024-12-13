import Link from 'next/link';

import { ChevronRightIcon } from 'lucide-react';

export default function ReservationsPage() {
	const bookings = [];
	return (
		<div>
			<h2 className="mb-7 text-2xl font-semibold text-accent">Your Reservations</h2>
			{bookings.length === 0 ? (
				<p className="transition-colors duration-300">
					You have no reservations yet. Check out our{' '}
					<Link
						href="/cabins"
						className="text-accent underline underline-offset-2 hover:text-accent/80"
					>
						luxury cabins
						<ChevronRightIcon className="inline-block size-4" />
					</Link>
				</p>
			) : (
				<div>Bookings card</div>
			)}
		</div>
	);
}
