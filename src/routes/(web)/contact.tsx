import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/contact')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/contact"!</div>
}
