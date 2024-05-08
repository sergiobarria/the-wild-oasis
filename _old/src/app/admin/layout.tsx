import { DashboardLayout } from './_components/dashboard-layout';

type LayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function AdminLayout({ children }: LayoutProps) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
