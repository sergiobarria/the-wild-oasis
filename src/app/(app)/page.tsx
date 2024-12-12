import Image from 'next/image';

import config from '@payload-config';
import { getPayload } from 'payload';

import { getFirstImageAlt, getFirstImageURL } from '@/lib/media-helpers';
import { Media } from '@/payload-types';

export default async function HomePage() {
	const payload = await getPayload({ config });
	const cabins = await payload.find({
		collection: 'cabins',
		pagination: true,
		depth: 1,
		page: 1,
		limit: 10,
		where: {
			published: { equals: true },
		},
	});
	const firstImageURL = getFirstImageURL(cabins.docs.at(0)?.images as Media[]);
	const firstImageAlt = getFirstImageAlt(cabins.docs.at(0)?.images as Media[], 'Cabin image');

	return (
		<div className="text-xs">
			<div className="relative h-40 max-w-40">
				<Image
					src={firstImageURL}
					fill
					alt={firstImageAlt}
					className="aspect-square size-full object-cover"
				/>
			</div>
			<pre>{JSON.stringify(cabins, null, 2)}</pre>
		</div>
	);
}
