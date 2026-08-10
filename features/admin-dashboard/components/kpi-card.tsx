import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

type KpiCardProps = {
    label: string;
    value: string;
    icon: LucideIcon;
    hint?: string;
};

export function KpiCard({ label, value, icon: Icon, hint }: KpiCardProps) {
    return (
        <Card>
            <CardContent className='flex items-start justify-between gap-4'>
                <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>{label}</p>
                    <p className='font-heading text-2xl font-medium'>{value}</p>
                    {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
                </div>
                <Icon className='size-5 text-muted-foreground' aria-hidden='true' />
            </CardContent>
        </Card>
    );
}
