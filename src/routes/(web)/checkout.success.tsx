import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/checkout/success')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/checkout/success"!</div>
}
