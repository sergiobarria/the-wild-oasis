import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

import * as TanstackQuery from './integrations/query-provider'
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
    const rqContext = TanstackQuery.getContext()

    const router = createRouter({
        routeTree,
        context: { ...rqContext },
        defaultPreload: 'intent',
        Wrap: (props: { children: React.ReactNode }) => {
            return <TanstackQuery.Provider {...rqContext}>{props.children}</TanstackQuery.Provider>
        },
    })

    nProgress.configure({ showSpinner: false })

    router.subscribe('onBeforeLoad', ({ pathChanged }) => {
        pathChanged && typeof document !== 'undefined' && nProgress.start()
    })

    router.subscribe('onLoad', ({ pathChanged }) => {
        pathChanged && typeof document !== 'undefined' && nProgress.done()
    })

    setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

    return router
}
