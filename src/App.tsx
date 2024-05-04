import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import {
	DashboardLayout,
	DashboardHomePage,
	DashboardAccountPage,
	DashboardBookingsPage,
	DashboardCabinPage,
	DashboardSettingsPage,
	DashboardUsersPage
} from './pages';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Navigate to="/dashboard" />} />
				<Route path="dashboard" element={<DashboardLayout />}>
					<Route index element={<DashboardHomePage />} />
					<Route path="bookings" element={<DashboardBookingsPage />} />
					<Route path="cabins" element={<DashboardCabinPage />} />
					<Route path="users" element={<DashboardUsersPage />} />
					<Route path="settings" element={<DashboardSettingsPage />} />
					<Route path="account" element={<DashboardAccountPage />} />
				</Route>
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}
