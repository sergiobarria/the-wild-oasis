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
    return <div>Hello "/(web)/guest"!</div>
}
