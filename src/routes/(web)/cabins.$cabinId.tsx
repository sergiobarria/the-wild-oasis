import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/cabins/$cabinId')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/cabins/$cabinId"!</div>
}
