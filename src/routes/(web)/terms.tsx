import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/terms')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/terms"!</div>
}
