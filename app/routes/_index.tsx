import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { ModeToggle } from '~/components/site/mode-toggle'
import { Button } from '~/components/ui/button'

export const meta: MetaFunction = () => {
	return [
		{ title: 'The Wild Oasis' },
		{ name: 'description', content: 'Beautiful cabins in the woods' },
	]
}

export default function Index() {
	return (
		<div>
			<Button onClick={() => alert('IT WORKS!')}>Click me</Button>
			<ModeToggle />
			<Button asChild>
				<Link to="/dashboard">Go to Dashboard</Link>
			</Button>
		</div>
	)
}
