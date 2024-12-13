import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/_components/ui/button';

import bg from '../../public/bg.png';

export default function Home() {
	return (
		<div className="mt-24">
			<Image
				src={bg}
				fill
				placeholder="blur"
				quality={80}
				className="object-cover"
				priority
				alt="Mountains and forests with two cabins"
			/>

			<div className="relative z-10 text-center">
				<h1 className="mb-10 text-8xl font-normal tracking-tight">Welcome to paradise.</h1>
				<Button size="lg" asChild>
					<Link href="/cabins">Explore luxury cabins</Link>
				</Button>
			</div>
		</div>
	);
}
