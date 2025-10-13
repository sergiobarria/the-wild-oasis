import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/guest')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/guest"!</div>
}
