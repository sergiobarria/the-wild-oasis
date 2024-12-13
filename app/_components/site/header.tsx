import { Logo } from './logo';
import { Navigation } from './navigation';

export function Header() {
	return (
		<header className="border-b border-border px-8 py-5">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				<Logo />
				<Navigation />
			</div>
		</header>
	);
}
