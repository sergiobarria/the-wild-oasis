import { Button } from '@/components/ui';
import { CabinTable } from '@/features/cabins/cabin-table';
import { CreateCabinForm } from '@/features/cabins/create-cabin-form';
import { useState } from 'react';

export function Cabins() {
    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <div className="flex items-center justify-between">
                <h2>All Cabins</h2>
                <div>Filter / Sort</div>
            </div>

            <CabinTable />

            <Button onClick={() => setShowForm(show => !show)}>Add New Cabin</Button>

            {showForm && <CreateCabinForm />}
        </>
    );
}
