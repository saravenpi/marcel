<script lang="ts">
	import { enhance } from "$app/forms";
	import type { EventType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import Modal from "./Modal.svelte";
	import { Button } from "./ui/button";
	import { toast } from "svelte-sonner";

	// variables
	export let event: EventType;
	export let destroy: (eventId: string) => void;

	let modal = false;

	function handleDelete(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			destroy(event.id);
		} else {
			toast.error(result.data.error);
		}
	}

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString();
	}
</script>

<Modal bind:open={modal} title={event.title} description={event.description}>
	<div class="flex flex-row gap-3 w-full justify-evenly">
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
			<Button class="flex flex-row gap-2" type="submit">
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
