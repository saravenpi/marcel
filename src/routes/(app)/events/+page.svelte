<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Event from "$lib/components/Event.svelte";
	import type { EventType } from "$lib/types";
	import EventModal from "./EventModal.svelte";
	import Icon from "@iconify/svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import { Separator } from "$lib/components/ui/separator";

	export let data: { events: EventType[]; user: any };

	// variables
	let events: EventType[] = data.events;
	let eventModal = false;
	let groupedEvents: { [key: string]: EventType[] } = {};

	function formatDate(date: string) {
		date = date.replaceAll("/", "-");
		const options: Intl.DateTimeFormatOptions = {
			weekday: "long",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		};
		return new Date(date).toLocaleDateString(undefined, options);
	}
	// Function to group events by day
	const groupEventsByDay = (events: EventType[]) => {
		return events.reduce(
			(groups, event) => {
				let date = new Date(event.date).toDateString();
				if (!groups[date]) {
					groups[date] = [];
				}
				groups[date].push(event);
				return groups;
			},
			{} as { [key: string]: EventType[] },
		);
	};

	// Function to destroy event by id
	function destroyEvent(eventId: string) {
		events = events.filter((event) => event.id !== eventId);
		groupedEvents = groupEventsByDay(events);
	}

	// Group events
	groupedEvents = groupEventsByDay(events);
</script>

<EventModal bind:events bind:eventModal {groupEventsByDay} bind:groupedEvents />
<div class="flex flex-col gap-6">
	<div class="w-full flex flex-row justify-between">
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="heroicons:calendar" class="size-7" />
			Events
		</span>
		<Button
			on:click={() => (eventModal = !eventModal)}
			class="flex flex-row gap-2"
		>
			<Icon icon="heroicons:plus" class="size-5" />
			<span class="hidden md:flex">Create Event</span>
		</Button>
	</div>

	<Separator class="m-0" />
	{#if groupedEvents && Object.keys(groupedEvents).length > 0}
		<ScrollArea orientation="vertical" class="mb-[60px]">
			{#each Object.keys(groupedEvents) as date}
				<div class="group">
					<h2 class="text-2xl font-semibold mt-4">
						{formatDate(date)}
					</h2>
					<div class="flex flex-col gap-2 mt-3">
						{#each groupedEvents[date] as event}
							<Event {event} destroy={destroyEvent} />
						{/each}
					</div>
				</div>
			{/each}
		</ScrollArea>
	{:else}
		<div class="text-center">No events found</div>
	{/if}
</div>
