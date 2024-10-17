<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import Modal from "$lib/components/Modal.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { TodoType } from "$lib/types";
	import Icon from "@iconify/svelte";

	// variables
	export let todoModal = false;
	export let todos: TodoType[] = [];

	// form variables
	let title: string = "";

	// function to handle add todo server result
	function handleAdd(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			todoModal = false;
			if (!result.data.data) return;
			todos = [...todos, result.data.data];
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open={todoModal} title="Create a todo" description="">
	<form
		action="?/addTodo"
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
			<Button type="submit">
				<Icon icon="akar-icons:plus" class="size-6 mr-2" />
				Create
			</Button>
		</div>
	</form>
</Modal>
