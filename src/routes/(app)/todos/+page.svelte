<script lang="ts">
	import Todo from "$lib/components/Todo.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Button } from "$lib/components/ui/button";
	import type { TodoType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import TodoModal from "./TodoModal.svelte";
	import { Separator } from "$lib/components/ui/separator";

	export let data: { todos: TodoType[] };

	let todos: TodoType[] = data.todos;
	let todoModal = false;

	// Function to destroy todo by id
	function destroyTodo(todoId: string) {
		todos = todos.filter((todo) => todo.id !== todoId);
	}
</script>

<TodoModal bind:todos bind:todoModal />
<div class="flex flex-col gap-6">
	<div class="w-full flex flex-row justify-between">
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="heroicons:check-circle" class="size-7" />
			Todos</span
		>
		<Button on:click={() => (todoModal = true)} class="flex flex-row gap-2">
			<Icon icon="heroicons:plus" class="size-5" />
			<span class="hidden md:flex">Create Todo</span>
		</Button>
	</div>

	<Separator class="m-0" />

	{#if todos && todos.length > 0}
		<ScrollArea orientation="vertical" class="mb-[60px]">
			<div class="flex flex-col gap-4">
				{#each todos as todo}
					<Todo {todo} destroy={destroyTodo} />
				{/each}
			</div>
		</ScrollArea>
	{:else}
		<div class="text-center">No todos found</div>
	{/if}
</div>
