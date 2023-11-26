import { Outlet } from 'react-router-dom';

import { Header, Sidebar } from '@/components';

export function AppLayout() {
    return (
        <div className="grid h-screen grid-cols-[26rem_1fr] grid-rows-[auto_1fr]">
            <Header />
            <Sidebar />
            <main className="bg-neutral-50 px-16 py-20">
                <Outlet />
            </main>
        </div>
    );
}
