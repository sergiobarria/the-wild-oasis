import { Outlet } from 'react-router-dom';

import { Header, Sidebar } from '@/components';

export function AppLayout() {
    return (
        <div className="grid h-screen grid-cols-[14rem_1fr] grid-rows-[auto_1fr]">
            <Header />
            <Sidebar />
            <main className="bg-neutral-50 px-10 py-14">
                <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
