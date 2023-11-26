import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import type { Cabin } from '@/types/database';
import { formatCurrency } from '@/lib/helpers';
import { CabinsTableActions } from './cabins-table-actions';

const helper = createColumnHelper<Cabin>();

export const cabinTableColumns = [
    helper.accessor('image_url', {
        id: 'image_url',
        header: 'Image',
        cell: props => (
            <img
                src={props.getValue() ?? 'https://placehold.co/75'}
                className="h-20 w-20 rounded-lg"
                width={80}
                height={80}
                alt={props.row.getValue('name')}
            />
        ),
    }),
    helper.accessor('name', {
        id: 'name',
        cell: props => <span>{props.getValue()?.toUpperCase()}</span>,
    }),
    helper.accessor('max_capacity', {
        id: 'max_capacity',
        header: 'Capacity',
        cell: props => <span>Fits up to {props.getValue()} guests</span>,
    }),
    helper.accessor('regular_price', {
        id: 'price',
        header: 'Price (USD)',
        cell: props => <span>{formatCurrency(props.getValue())}</span>,
    }),
    helper.accessor('discount', {
        id: 'discount',
        header: 'Discount',
        cell: props => {
            const discount = props.getValue();

            return discount ? <span>{formatCurrency(discount)}</span> : null;
        },
    }),
    helper.display({
        id: 'actions',
        header: 'Actions',
        cell: props => {
            const cabinId = props.row.original.id;

            return <CabinsTableActions itemId={cabinId} />;
        },
    }),
] as ColumnDef<Cabin>[];
