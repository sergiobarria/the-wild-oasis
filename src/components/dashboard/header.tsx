import { Link } from '@tanstack/react-router'

import { ExternalLinkIcon } from 'lucide-react'

import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { DashboardSidebarTrigger } from './sidebar-trigger'

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
                <DashboardSidebarTrigger />

                <Separator orientation="vertical" className="h-4" />

                <Button variant="outline" asChild>
                    <Link to="/">
                        View Website
                        <ExternalLinkIcon />
                    </Link>
                </Button>
            </div>

            <ThemeToggle />
        </header>
    )
}
