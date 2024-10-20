<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import Modal from "$lib/components/Modal.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { NoteType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { Textarea } from "$lib/components/ui/textarea";

	// variables
	export let open = false;
	export let notes: NoteType[] = [];
	export let notebookId: string;

	// form variables
	let title: string = "";
	let content: string = "";

	// function to handle add todo server result
	function handleAdd(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			open = false;
			if (!result.data.data) return;
			notes = [...notes, result.data.data];
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open title="Create a new note" description="">
	<form
		action="?/addNote"
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
			<Textarea
				name="content"
				placeholder="Add content"
				value={content}
			/>
			<input type="hidden" name="notebookId" value={notebookId} />
			<Button type="submit">
				<Icon icon="akar-icons:plus" class="size-6 mr-2" />
				Create
			</Button>
		</div>
	</form>
</Modal>
