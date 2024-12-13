import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Cabins',
};

export default function CabinsPage() {
	const cabins = [];

	return (
		<>
			<h1 className="mb-5 text-4xl font-medium text-accent">Our Luxury Cabins</h1>
			<p className="mb-10 text-lg text-foreground">
				Cozy yet luxurious cabins, located right in the heart of the Italian Dolomites.
				Imagine waking up to beautiful mountain views, spending your days exploring the dark
				forests around, or just relaxing in your private hot tub under the stars. Enjoy
				nature&apos;s beauty in your own little home away from home. The perfect spot for a
				peaceful, calm vacation. Welcome to paradise.
			</p>

			{cabins.length > 0 && (
				<div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
					{cabins.map(cabin => (
						<div key={cabin.id}>cabin</div>
					))}
				</div>
			)}
		</>
	);
}
