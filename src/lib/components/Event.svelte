<script lang="ts">
	import { enhance } from "$app/forms";
	import type { EventType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import Modal from "./Modal.svelte";
	import { Button } from "./ui/button";
	import { toast } from "svelte-sonner";
	import { Input } from "./ui/input";
	import DateButton from "./DateButton.svelte";
	import { Label } from "./ui/label";
	import AddressButton from "./AddressButton.svelte";

	// variables
	export let event: EventType;
	export let destroy: (eventId: string) => void;

	import { CalendarDate } from "@internationalized/date";

	let modal: boolean = false;

	function convertToDateValue(dateString: string): CalendarDate {
		let year: number = new Date(dateString).getFullYear();
		let month: number = new Date(dateString).getMonth();
		let day: number = new Date(dateString).getDate();

		return new CalendarDate(year, month, day);
	}
	let date: CalendarDate = convertToDateValue(event.date);
	let address: string | undefined = event.address;
	let title: string = event.title;
	let description: string = event.description;

	function handleDelete(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			destroy(event.id);
		} else {
			toast.error(result.data.error);
		}
	}

	function handleUpdate(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			event = result.data.data;
			date = convertToDateValue(event.date);
			address = event.address;
			title = event.title;
			description = event.description;
		} else {
			toast.error(result.data.error);
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString();
	}
</script>

<Modal bind:open={modal} title={event.title} description="">
	<div class="flex flex-col gap-3 w-full justify-evenly">
		<!-- Edit event form -->
		<form
			action="?/updateEvent"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleUpdate(result);
				};
			}}
			class="flex flex-col gap-3"
		>
			<Label for="title">Title</Label>
			<Input
				type="text"
				name="title"
				value={title}
				placeholder="Pick a title"
			/>

			<Label for="description">Description</Label>
			<Input type="text" name="description" value={description} />

			<Label for="date">Date</Label>
			<DateButton bind:value={date} />
			<input type="hidden" name="date" bind:value={date} />

			<Label for="address">Address</Label>
			<AddressButton bind:address finalAddress={address} />

			<input type="hidden" name="eventId" value={event.id} />
			<Button class="flex flex-row gap-2" type="submit">
				<Icon icon="heroicons:pencil" class="size-5" />
				Update
			</Button>
		</form>
		<form
			action="?/deleteEvent"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleDelete(result);
				};
			}}
		>
			<input type="hidden" name="eventId" value={event.id} />
			<Button
				class="flex flex-row gap-2 w-full bg-transparent border text-white"
				type="submit"
			>
				<Icon icon="heroicons:trash" class="size-5" />
				Delete
			</Button>
		</form>
	</div>
</Modal>
<div class="rounded-xl flex flex-col p-5 bg-neutral-100 dark:bg-neutral-800">
	<div class="flex flex-row justify-between">
		<span class="text-2xl">{event.title}</span>
		<Button
			on:click={() => {
				modal = true;
			}}
			class="bg-transparent text-black dark:text-white hover:bg-gray-200 p-1"
		>
			<Icon icon="mage:dots" class="size-5" />
		</Button>
	</div>
	<span
		class="text-md text-gray-800 dark:text-gray-300 flex flex-row place-items-center"
	>
		<Icon icon="mdi:calendar" class="mr-2 h-4" />
		{formatDate(event.date)}
	</span>
	{#if event.address}
		<span
			class="text-md text-gray-800 dark:text-gray-300 flex flex-row place-items-center"
		>
			<Icon icon="mdi:location" class="mr-2 h-4 w-4" />
			{event.address}
		</span>
	{/if}
	<span class="text-sm text-gray-800 dark:text-gray-300 mt-4"
		>{event.description}</span
	>
</div>
