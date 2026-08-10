import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { type ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { ChartCard } from './chart-card';

const chartConfig = {
    count: { label: 'Bookings', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function BookingsOverTimeChart({ data }: { data: { date: string; count: number }[] }) {
    return (
        <ChartCard
            title='Bookings over time'
            config={chartConfig}
            tableHeaders={['Date', 'Bookings']}
            tableRows={data.map((row) => ({ label: row.date, value: String(row.count) }))}
        >
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey='date'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value: string) => value.slice(5)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='count' fill='var(--color-count)' radius={4} />
            </BarChart>
        </ChartCard>
    );
}
