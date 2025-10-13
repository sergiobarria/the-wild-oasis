import { Outlet, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { APP_NAME } from '@/config/constants'

const getDefaultSidebarStateFn = createServerFn().handler(() => {
    const defaultOpen = getCookie('sidebar_state')
    return defaultOpen === 'true'
})

export const Route = createFileRoute('/admin')({
    beforeLoad: async () => {
        const defaultOpen = await getDefaultSidebarStateFn()

        return { defaultOpen }
    },
    head: () => ({
        meta: [{ title: `Admin | ${APP_NAME}` }],
    }),
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <SidebarProvider defaultOpen={Route.useRouteContext().defaultOpen}>
            <DashboardSidebar />

            <main className="flex h-screen w-full flex-col">
                <DashboardHeader />

                <div className="flex-grow overflow-y-auto px-5 py-4">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    )
}
