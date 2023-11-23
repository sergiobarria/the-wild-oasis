import { Button } from './components/ui';

export default function App() {
    return (
        <h1 className="text-3xl font-semibold underline">
            <Button onClick={() => alert('Button working')}>Click me</Button>
        </h1>
    );
}
