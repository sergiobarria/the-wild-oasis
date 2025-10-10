import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/cabins')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/admin/cabins"!</div>
}
