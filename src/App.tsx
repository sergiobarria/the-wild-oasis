import { Button } from './components/ui/button'

export default function App() {
	return (
		<div className="text-4xl font-bold">
			hello world
			<Button onClick={() => alert('IT WORKS!')}>Click me</Button>
		</div>
	)
}
