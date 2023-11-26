import { CabinTable } from '@/features/cabins/cabin-table';

export function Cabins() {
    return (
        <>
            <div className="flex items-center justify-between">
                <h2>All Cabins</h2>
                <div>Filter / Sort</div>
            </div>

            <CabinTable />
        </>
    );
}
