<script lang="ts">
	import Habit from "$lib/components/Habit.svelte";
	import { Button } from "$lib/components/ui/button";
	import { type HabitType, type User } from "$lib/types";
	import Icon from "@iconify/svelte";
	import HabitModal from "./HabitModal.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	export let data: { habits: HabitType[]; user: User };

	let habits: HabitType[] = data.habits;
	let modal = false;

	// Function to destroy todo by id
	function destroyHabit(todoId: string) {
		habits = habits.filter((todo) => todo.id !== todoId);
	}
</script>

<HabitModal bind:habits bind:modal />
<div class="flex flex-col gap-6">
	<div class="w-full flex flex-row justify-between">
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="iconoir:calendar-check" class="size-7" />
			Habits</span
		>
		<Button on:click={() => (modal = true)} class="flex flex-row gap-2">
			<Icon icon="heroicons:plus" class="size-5" />
			Create Habit
		</Button>
	</div>

	{#if habits && habits.length > 0}
		<ScrollArea orientation="vertical" class="-z-10">
			<div class="flex flex-col gap-4">
				{#each habits as habit}
					<Habit {habit} destroy={destroyHabit} />
				{/each}
			</div>
		</ScrollArea>
	{:else}
		<div class="text-center">No habits found</div>
	{/if}
</div>
