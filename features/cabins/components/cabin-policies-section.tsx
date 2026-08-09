import { CABIN_POLICIES } from '../cabin-policies';

export function CabinPoliciesSection() {
    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4 text-sm sm:max-w-xs'>
                <div>
                    <p className='text-muted-foreground'>Check-in</p>
                    <p className='font-medium'>{CABIN_POLICIES.checkInTime}</p>
                </div>
                <div>
                    <p className='text-muted-foreground'>Check-out</p>
                    <p className='font-medium'>{CABIN_POLICIES.checkOutTime}</p>
                </div>
            </div>

            <ul className='list-inside list-disc space-y-1 text-sm text-muted-foreground'>
                {CABIN_POLICIES.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                ))}
            </ul>
        </div>
    );
}
