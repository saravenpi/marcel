<script lang="ts">
	import { enhance } from "$app/forms";
	import type { TodoType } from "$lib/types";
	import { toast } from "svelte-sonner";
	import Modal from "./Modal.svelte";
	import { Button } from "./ui/button";
	import Icon from "@iconify/svelte";

	// variables
	export let destroy: (todoId: string) => void;
	export let todo: TodoType;

	let modal = false;

	function handleDelete(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			destroy(todo.id);
		} else {
			toast.error(result.data.error);
		}
	}
	function handleUpdate(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			todo = result.data.data;
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open={modal} title={todo.title} description="">
	<div class="flex flex-col gap-3 w-full">
		<form
			action="?/updateTodo"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleUpdate(result);
				};
			}}
		>
			<input type="hidden" name="todoId" value={todo.id} />
			<input
				type="hidden"
				name="done"
				value={todo.done ? "false" : "true"}
			/>
			<Button
				class="flex flex-row gap-2 w-full"
				type="submit"
				variant={todo.done ? "outline" : "default"}
			>
				{todo.done ? "Undone" : "Done"}
			</Button>
		</form>
		<form
			action="?/deleteTodo"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleDelete(result);
				};
			}}
		>
			<input type="hidden" name="todoId" value={todo.id} />
			<Button class="flex flex-row gap-2 w-full" type="submit">
				<Icon icon="heroicons:trash" class="size-5" />
				Delete
			</Button>
		</form>
	</div>
</Modal>
<div class="rounded border flex flex-col p-5">
	<div class="flex flex-row justify-between place-items-center">
		{#if todo.done}
			<span class="text-xl line-through text-gray-700">{todo.title}</span>
		{:else}
			<span class="text-xl">{todo.title}</span>
		{/if}
		<div class="flex flex-row gap-3">
			<form
				action="?/updateTodo"
				method="POST"
				use:enhance={() => {
					return ({ result }) => {
						handleUpdate(result);
					};
				}}
			>
				<input type="hidden" name="todoId" value={todo.id} />
				<input
					type="hidden"
					name="done"
					value={todo.done ? "false" : "true"}
				/>
				<Button
					class="flex flex-row gap-2"
					type="submit"
					variant={todo.done ? "outline" : "default"}
				>
					{todo.done ? "Undone" : "Done"}
				</Button>
			</form>
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
