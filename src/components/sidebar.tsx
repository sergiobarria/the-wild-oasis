import { Logo } from './logo';
import { MainNavigation } from './main-navigation';

export function Sidebar() {
    return (
        <aside className="row-span-full flex flex-col gap-14 border-r border-neutral-100 bg-white px-10 py-12">
            <Logo />
            <MainNavigation />
        </aside>
    );
}
