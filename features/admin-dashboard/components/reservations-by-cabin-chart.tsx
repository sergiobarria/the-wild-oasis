import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
    count: { label: 'Reservations', color: 'var(--chart-3)' },
} satisfies ChartConfig;

export function ReservationsByCabinChart({
    data,
}: {
    data: { cabinName: string; count: number }[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-base'>Reservations by cabin</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
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
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
