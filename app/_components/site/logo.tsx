import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
	return (
		<Link href="/" className="z-10 flex items-center gap-4">
			<Image src="/logo.png" alt="logo" height={60} width={60} quality={100} />
			<span className="text-xl font-semibold text-foreground">The Wild Oasis</span>
		</Link>
	);
}
