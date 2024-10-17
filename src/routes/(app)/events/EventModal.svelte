<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import Modal from "$lib/components/Modal.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { EventType } from "$lib/types";
	import DateButton from "$lib/components/DateButton.svelte";
	import Icon from "@iconify/svelte";
	import AddressButton from "$lib/components/AddressButton.svelte";

	// variables
	export let eventModal = false;
	export let events: EventType[] = [];
	export let groupEventsByDay: (
		events: EventType[],
	) => { [key: string]: EventType[] } = () => {
		return {};
	};
	export let groupedEvents: { [key: string]: EventType[] } = {};

	// form variables
	let title: string = "";
	let description: string = "";
	let date: any = undefined;
	let address: string = "";

	// function to handle add event server result
	function handleAdd(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			eventModal = false;
			if (!result.data.data) return;
			events = [...events, result.data.data];
			groupedEvents = groupEventsByDay(events);
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open={eventModal} title="Create an Event" description="">
	<form
		action="?/addEvent"
		method="POST"
		use:enhance={() => {
			return ({ result }) => {
				handleAdd(result);
			};
		}}
	>
		<div class="flex flex-col gap-6">
			<Input
				type="text"
				name="title"
				value={title}
				placeholder="Add a title"
			/>
			<Input
				type="text"
				name="description"
				value={description}
				placeholder="Add a description"
			/>
			<AddressButton bind:address />
			<input type="hidden" name="address" bind:value={address} />
			<DateButton bind:value={date} />
			<input type="hidden" name="date" bind:value={date} />
			<Button type="submit">
				<Icon icon="akar-icons:plus" class="size-6 mr-2" />
				Create
			</Button>
		</div>
	</form>
</Modal>
