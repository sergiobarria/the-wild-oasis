import { Logo } from './logo';
import { MainNavigation } from './main-navigation';

export function Sidebar() {
    return (
        <aside className="row-span-full flex flex-col gap-8 border-r border-neutral-100 bg-white px-6 py-8">
            <Logo />
            <MainNavigation />
        </aside>
    );
}
