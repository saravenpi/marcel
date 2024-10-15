<script lang="ts">
	import CalendarIcon from "svelte-radix/Calendar.svelte";
	import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	export let date: any = undefined;

	const df = new DateFormatter("en-US", {
		dateStyle: "long",
	});
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				"justify-start text-left font-normal",
				!date && "text-muted-foreground",
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a date"}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar bind:value={date} />
	</Popover.Content>
</Popover.Root>
