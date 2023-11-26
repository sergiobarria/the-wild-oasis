import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import {
    Account,
    Bookings,
    Cabins,
    Dashboard,
    Login,
    PageNotFound,
    Settings,
    Users,
} from '@/pages';
import { AppLayout } from './layouts/app-layout';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0, // default was 1 minute
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<Navigate replace to="dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="bookings" element={<Bookings />} />
                        <Route path="cabins" element={<Cabins />} />
                        <Route path="users" element={<Users />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="account" element={<Account />} />
                    </Route>

                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster
                position="top-right"
                gutter={12}
                containerStyle={{ margin: '8px' }}
                reverseOrder={false}
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 5000,
                    },
                    style: {
                        fontSize: '1rem',
                        maxWidth: '500px',
                        padding: '16px 24px',
                        backgroundColor: '#f5f5f5',
                        color: '#404040',
                    },
                }}
            />
        </QueryClientProvider>
    );
}
