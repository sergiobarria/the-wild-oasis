import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { type ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCents } from '@/lib/money';

import { ChartCard } from './chart-card';

const chartConfig = {
    cents: { label: 'Revenue', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function RevenueOverTimeChart({ data }: { data: { date: string; cents: number }[] }) {
    return (
        <ChartCard
            title='Revenue over time'
            config={chartConfig}
            tableHeaders={['Date', 'Revenue']}
            tableRows={data.map((row) => ({ label: row.date, value: formatCents(row.cents) }))}
        >
            <LineChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey='date'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value: string) => value.slice(5)}
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name) => (
                                <div className='flex w-full items-center gap-2'>
                                    <div
                                        className='h-2.5 w-2.5 shrink-0 rounded-[2px]'
                                        style={{ backgroundColor: 'var(--color-cents)' }}
                                    />
                                    <span className='text-muted-foreground'>
                                        {chartConfig[name as keyof typeof chartConfig]?.label ??
                                            name}
                                    </span>
                                    <span className='ml-auto font-mono font-medium text-foreground'>
                                        {formatCents(Number(value))}
                                    </span>
                                </div>
                            )}
                        />
                    }
                />
                <Line
                    dataKey='cents'
                    type='monotone'
                    stroke='var(--color-cents)'
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartCard>
    );
}
