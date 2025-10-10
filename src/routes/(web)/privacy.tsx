import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/privacy')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/(web)/privacy"!</div>
}
