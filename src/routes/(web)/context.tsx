import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/context')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/context"!</div>
}
