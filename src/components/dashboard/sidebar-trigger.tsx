import { PanelRightClose, PanelRightOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

export function DashboardSidebarTrigger() {
    const sidebar = useSidebar()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={sidebar.toggleSidebar}
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
        >
            {sidebar.open ? <PanelRightOpen /> : <PanelRightClose />}
        </Button>
    )
}
