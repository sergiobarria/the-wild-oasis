import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCents } from '@/lib/money';

const chartConfig = {
    cents: { label: 'Revenue', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function RevenueOverTimeChart({ data }: { data: { date: string; cents: number }[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-base'>Revenue over time</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
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
                                    formatter={(value) => formatCents(Number(value))}
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
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
