import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(web)/')({
    component: App,
})

function App() {
    return <div>hellowww</div>
}
