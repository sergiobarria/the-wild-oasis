import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { type ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { ChartCard } from './chart-card';

const chartConfig = {
    count: { label: 'Reservations', color: 'var(--chart-3)' },
} satisfies ChartConfig;

export function ReservationsByCabinChart({
    data,
}: {
    data: { cabinName: string; count: number }[];
}) {
    return (
        <ChartCard
            title='Reservations by cabin'
            config={chartConfig}
            tableHeaders={['Cabin', 'Reservations']}
            tableRows={data.map((row) => ({ label: row.cabinName, value: String(row.count) }))}
        >
            <BarChart accessibilityLayer data={data} layout='vertical'>
                <CartesianGrid horizontal={false} />
                <YAxis
                    dataKey='cabinName'
                    type='category'
                    tickLine={false}
                    axisLine={false}
                    width={100}
                />
                <XAxis dataKey='count' type='number' hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='count' fill='var(--color-count)' radius={4} />
            </BarChart>
        </ChartCard>
    );
}
