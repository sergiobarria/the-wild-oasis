import DashboardLayout from './dashboard-layout';

export default function DashboardRootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
