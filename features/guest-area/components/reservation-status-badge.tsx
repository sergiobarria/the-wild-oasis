import { Badge } from '@/components/ui/badge';
import type { ReservationStatus } from '@/convex/lib/reservations';

const STATUS_LABELS: Record<ReservationStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const STATUS_VARIANTS: Record<ReservationStatus, 'default' | 'secondary' | 'outline'> = {
    pending: 'secondary',
    confirmed: 'default',
    completed: 'outline',
    cancelled: 'outline',
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
    return <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>;
}
