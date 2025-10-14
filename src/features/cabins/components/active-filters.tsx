import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterItem {
    key: string
    label: string
    value: string
}

interface ActiveFiltersProps {
    filters: FilterItem[]
    onRemoveFilter: (key: string) => void
    onClearAll: () => void
    className?: string
}

function FilterBadge({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
    return (
        <div className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors">
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-semibold">{value}</span>
            <button
                type="button"
                onClick={onRemove}
                className="text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground focus:ring-ring ml-0.5 inline-flex size-4 items-center justify-center rounded-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none"
                aria-label={`Remove ${label} filter`}
            >
                <XIcon className="size-3" />
            </button>
        </div>
    )
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll, className }: ActiveFiltersProps) {
    if (filters.length === 0) return null

    return (
        <div
            className={cn(
                'bg-muted/10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-3',
                className,
            )}
        >
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm font-medium">
                    Active Filter{filters.length > 1 ? 's' : ''}:
                </span>

                {filters.map((filter) => (
                    <FilterBadge
                        key={filter.key}
                        label={filter.label}
                        value={filter.value}
                        onRemove={() => onRemoveFilter(filter.key)}
                    />
                ))}
            </div>

            <Button variant="ghost" size="sm" onClick={onClearAll} className="hover:text-destructive shrink-0 text-xs">
                Clear All
            </Button>
        </div>
    )
}
