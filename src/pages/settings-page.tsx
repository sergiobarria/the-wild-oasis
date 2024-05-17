import { useQuery } from 'convex/react'

import { api } from '~/_generated/api'
import { SettingsForm } from '@/components/settings/settings-form'
import { Loader2Icon } from 'lucide-react'

export function SettingsPage() {
	const settings = useQuery(api.settings.getFirst)

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Update Hotel Settings</h1>
			</div>

			{settings ? (
				<SettingsForm settings={settings} />
			) : (
				<div className="flex h-96 items-center justify-center">
					<Loader2Icon className="h-12 w-12 animate-spin text-primary" />
				</div>
			)}
		</>
	)
}
