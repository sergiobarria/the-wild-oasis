import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function FormControlsSection() {
    return (
        <section id='forms' className='scroll-mt-8 space-y-6'>
            <div className='space-y-2'>
                <h2 className='text-2xl font-medium'>Form controls</h2>
                <p className='max-w-2xl text-sm text-muted-foreground'>
                    Tab to any control below to see the focus ring -- it&apos;s the gold accent at
                    8.5:1 contrast, the same token used for primary buttons and active states.
                </p>
            </div>
            <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-2'>
                    <Label htmlFor='brand-name'>Full name</Label>
                    <Input id='brand-name' placeholder='Jamie Alder' />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='brand-guests'>Guests</Label>
                    <Select defaultValue='2'>
                        <SelectTrigger id='brand-guests' className='w-full'>
                            <SelectValue placeholder='Guests' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='1'>1 guest</SelectItem>
                            <SelectItem value='2'>2 guests</SelectItem>
                            <SelectItem value='4'>4 guests</SelectItem>
                            <SelectItem value='6'>6 guests</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='brand-email'>Email (invalid state)</Label>
                    <Input id='brand-email' defaultValue='not-an-email' aria-invalid />
                    <p className='text-xs text-destructive'>Enter a valid email address.</p>
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='brand-disabled'>Disabled</Label>
                    <Input id='brand-disabled' placeholder='Read-only for now' disabled />
                </div>
                <div className='space-y-2 sm:col-span-2'>
                    <Label htmlFor='brand-message'>Message</Label>
                    <Textarea
                        id='brand-message'
                        placeholder='Tell us about your stay...'
                        rows={3}
                    />
                </div>
                <div className='flex items-center gap-2 sm:col-span-2'>
                    <Checkbox id='brand-terms' defaultChecked />
                    <Label htmlFor='brand-terms' className='text-sm font-normal'>
                        I agree to the terms and privacy policy
                    </Label>
                </div>
            </div>
        </section>
    );
}
