import { createFileRoute } from '@tanstack/react-router'

import { Route as RouteIcon, Server, Shield, Sparkles, Waves, Zap } from 'lucide-react'

export const Route = createFileRoute('/(web)/')({
    component: App,
})

function App() {
    return <div>hellowwwww</div>
}
