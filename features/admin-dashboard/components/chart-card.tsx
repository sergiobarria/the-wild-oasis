import type { ComponentProps } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';

/**
 * Shared shell for every admin analytics chart -- Card/CardHeader/ChartContainer boilerplate
 * in one place, plus the sr-only data table docs/02_CODING_GUIDELINES.md §12 requires ("every
 * chart needs a text alternative... unreadable to a screen reader and unusable in a print
 * export"). The chart itself is `aria-hidden`; the table carries the same numbers for
 * assistive tech and printing.
 */
export function ChartCard({
    title,
    config,
    children,
    tableHeaders,
    tableRows,
}: {
    title: string;
    config: ChartConfig;
    children: ComponentProps<typeof ChartContainer>['children'];
    tableHeaders: [string, string];
    tableRows: { label: string; value: string }[];
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-base'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {tableRows.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No data yet.</p>
                ) : (
                    <>
                        <ChartContainer config={config} aria-hidden='true'>
                            {children}
                        </ChartContainer>
                        <table className='sr-only'>
                            <caption>{title}</caption>
                            <thead>
                                <tr>
                                    <th>{tableHeaders[0]}</th>
                                    <th>{tableHeaders[1]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row) => (
                                    <tr key={row.label}>
                                        <td>{row.label}</td>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
