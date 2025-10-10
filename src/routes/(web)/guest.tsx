import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/guest')({
    beforeLoad: async ({ context, location }) => {
        if (!context.session) {
            throw redirect({ to: '/sign-in', search: { redirect: location.href } })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { user } = Route.useRouteContext()

    return <div>Welcome back: {user?.name || user?.email}</div>
}
