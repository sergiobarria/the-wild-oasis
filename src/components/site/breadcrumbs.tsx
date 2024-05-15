import { Fragment } from 'react'

import { useLocation } from 'react-router-dom'
import { SlashIcon, HomeIcon } from 'lucide-react'

import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbSeparator,
	BreadcrumbLink,
} from '@/components/ui/breadcrumb'

export function Breadcrumbs() {
	const pathname = useLocation().pathname

	const breadcrumbs = pathname.split('/').filter((crumb) => crumb !== '')
	const dashboardIndex = breadcrumbs.findIndex((crumb) => crumb === 'dashboard')
	const filteredBreadcrumbs = breadcrumbs.slice(dashboardIndex)

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{filteredBreadcrumbs.map((crumb, index) => (
					<Fragment key={index}>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/${filteredBreadcrumbs.slice(0, index + 1).join('/')}`}
								className="capitalize"
							>
								{crumb === 'dashboard' ? <HomeIcon className="size-4" /> : crumb}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index !== filteredBreadcrumbs.length - 1 && (
							<BreadcrumbSeparator>
								<SlashIcon />
							</BreadcrumbSeparator>
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
