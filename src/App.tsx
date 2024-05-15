import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from './layouts/dashboard-layout'
import {
	AccountPage,
	BookingsPage,
	CabinsPage,
	LoginPage,
	NotFoundPage,
	OverviewPage,
	SettingsPage,
	UsersPage,
} from './pages'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Navigate to="dashboard" />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="dashboard" element={<DashboardLayout />}>
					<Route index element={<OverviewPage />} />
					<Route path="users" element={<UsersPage />} />
					<Route path="bookings" element={<BookingsPage />} />
					<Route path="cabins" element={<CabinsPage />} />
					<Route path="account" element={<AccountPage />} />
					<Route path="settings" element={<SettingsPage />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	)
}
