import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/checkout/cancel')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/checkout/cancel"!</div>
}
