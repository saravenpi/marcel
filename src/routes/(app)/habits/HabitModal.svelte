<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import Modal from "$lib/components/Modal.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { HabitType } from "$lib/types";
	import Icon from "@iconify/svelte";

	// variables
	export let modal = false;
	export let habits: HabitType[] = [];

	// form variables
	let name: string = "";

	// function to handle add todo server result
	function handleAdd(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			if (!result.data.data) return;
			habits = [...habits, result.data.data];
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open={modal} title="Create a habit" description="">
	<form
		action="?/addHabit"
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
				name="name"
				value={name}
				placeholder="Add a name"
			/>
			<Button type="submit">
				<Icon icon="akar-icons:plus" class="size-6 mr-2" />
				Create
			</Button>
		</div>
	</form>
</Modal>
