<script lang="ts">
	import { enhance } from "$app/forms";
	import type { HabitType } from "$lib/types";
	import { toast } from "svelte-sonner";
	import Modal from "./Modal.svelte";
	import { Button } from "./ui/button";
	import Icon from "@iconify/svelte";
	import { Label } from "./ui/label";
	import { Input } from "./ui/input";

	// variables
	export let habit: HabitType;
	export let destroy: (todoId: string) => void;

	let modal = false;
	let todayDone = false;

	todayDone = habit.completed.includes(new Date().toDateString());

	// form data
	let name: string = habit.name;

	let streak = getStreakCount(habit.completed);

	function getStreakCount(completed: string[]): number {
		// check for all the completed dates to compute the streak
		let count = 0;
		let currentDate = new Date(completed[0]);

		for (let i = 0; i < completed.length; i++) {
			if (currentDate.toDateString() === completed[i]) {
				count++;
				currentDate.setDate(currentDate.getDate() + 1);
			} else {
				currentDate.setDate(currentDate.getDate() + 1);
				if (currentDate.toDateString() === new Date().toDateString()) {
					count++;
				} else {
					break;
				}
			}
		}
		return count;
	}

	function handleDelete(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			destroy(habit.id);
		} else {
			toast.error(result.data.error);
		}
	}
	function handleUpdate(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			habit = result.data.data;
			todayDone = habit.completed.includes(new Date().toDateString());
			streak = getStreakCount(habit.completed);
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open={modal} title={habit.name} description="">
	<div class="flex flex-col gap-3 w-full">
		<!-- Edit habit form -->
		<form
			action="?/updateHabit"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleUpdate(result);
				};
			}}
			class="flex flex-col gap-3"
		>
			<Label for="name">Name</Label>
			<Input
				type="text"
				name="name"
				value={name}
				placeholder="Pick a name"
			/>

			<input type="hidden" name="name" bind:value={name} />
			<input type="hidden" name="habitId" value={habit.id} />
			<Button class="flex flex-row gap-2" type="submit">
				<Icon icon="heroicons:pencil" class="size-5" />
				Update
			</Button>
		</form>
		<form
			action="?/deleteHabit"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleDelete(result);
				};
			}}
		>
			<input type="hidden" name="habitId" value={habit.id} />
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

<div class="rounded-xl flex flex-col p-3 bg-neutral-100 dark:bg-neutral-800">
	<div class="flex flex-row justify-between place-items-center">
		<div class="flex flex-row gap-3 place-items-center">
			<form
				action="?/updateHabit"
				method="POST"
				use:enhance={() => {
					return ({ result }) => {
						handleUpdate(result);
					};
				}}
			>
				<input type="hidden" name="habitId" value={habit.id} />
				<input type="hidden" name="name" value={habit.name} />
				<input
					type="hidden"
					name="completionDate"
					value={new Date().toDateString()}
				/>
				<Button
					class="flex flex-row gap-2 bg-transparent text-black dark:text-white p-0 hover:bg-neutral-700 hover:text-white dark:hover:text-black"
					type="submit"
				>
					{#if todayDone}
						<Icon icon="jam:close" class="size-6" />
					{:else}
						<Icon icon="jam:check" class="size-6" />
					{/if}
				</Button>
			</form>
			{#if todayDone}
				<span
					class="text-xl line-through text-neutral-700 dark:text-neutral-400"
					>{habit.name}</span
				>
			{:else}
				<span class="text-xl">{habit.name}</span>
			{/if}
		</div>
		<div class="flex flex-row gap-3 place-items-center">
			<div class="text-xl">
				🔥 {streak}
			</div>
			<Button
				on:click={() => {
					modal = true;
				}}
				class="bg-transparent text-black dark:text-white hover:bg-gray-200 p-1"
			>
				<Icon icon="mage:dots" class="size-5" />
			</Button>
		</div>
	</div>
</div>
