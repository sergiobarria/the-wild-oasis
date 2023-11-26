import { useQuery } from '@tanstack/react-query';

import { LoadingSpinner, DataTable } from '@/components';
import { getCabins } from '@/services/cabins';

import { cabinTableColumns } from './table-columns';

export function CabinTable() {
    const {
        data: cabins,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['cabins'],
        queryFn: getCabins,
    });

    if (isLoading) return <LoadingSpinner />;

    if (isError) return <div>Something went wrong...</div>;

    return cabins && <DataTable columns={cabinTableColumns} data={cabins} />;
}
