import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
    count: { label: 'Bookings', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function BookingsOverTimeChart({ data }: { data: { date: string; count: number }[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-base'>Bookings over time</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
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
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
