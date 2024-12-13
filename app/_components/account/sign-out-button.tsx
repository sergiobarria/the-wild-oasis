import { LogOutIcon } from 'lucide-react';

export function SignOutButton() {
	return (
		<button className="flex w-full items-center gap-4 px-5 py-3 font-semibold text-foreground transition-colors hover:bg-muted hover:text-foreground/90">
			<LogOutIcon className="size-5 text-white" />
			<span>Sign Out</span>
		</button>
	);
}
