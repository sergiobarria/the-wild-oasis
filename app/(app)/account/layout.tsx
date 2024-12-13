import { SideNavigation } from '@/_components/site/side-navigation';

export default function AccountLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="grid h-full grid-cols-[16rem_1fr] gap-12">
			<SideNavigation />
			<div className="py-1">{children}</div>
		</div>
	);
}
