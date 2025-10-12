<script lang="ts">
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	import { Button } from '$lib/components/ui/button';
	import { Field, FieldSet } from '$lib/components/ui/field';
	import FieldLabel from '$lib/components/ui/field/field-label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import RangeCalendar from '$lib/components/ui/range-calendar/range-calendar.svelte';

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 2 });
	let value = $state({ start, end });
	let guests = $state(2);

	const bookedDates = Array.from({ length: 12 }, (_, i) => new CalendarDate(2025, 10, 15 + i));
</script>

<form class="space-y-6">
	<FieldSet>
		<Field>
			<FieldLabel>Pick your dates</FieldLabel>
			<RangeCalendar
				bind:value
				class="flex justify-center [--cell-size:--spacing(6)] md:[--cell-size:--spacing(10)]"
				isDateUnavailable={(date) => bookedDates.some((d) => d.compare(date) === 0)}
			/>
			<div class="text-center text-xs text-muted-foreground">A minimum of 5 days is required</div>
		</Field>

		<Field>
			<FieldLabel>Number of guests</FieldLabel>
			<Input type="number" min="1" max="30" name="guests" bind:value={guests} />
		</Field>
	</FieldSet>

	<Button type="submit" class="w-full">Book this cabin</Button>
</form>
