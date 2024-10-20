<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { NoteType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import CreateRessourceModal from "./CreateRessourceModal.svelte";
	import { toast } from "svelte-sonner";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Modal from "$lib/components/Modal.svelte";

	export let data: { note: NoteType };

	let note = data.note;
	let ressourceModal = false;
	let settingsModal = false;
	let isEditing = false;
	let editedTitle = note.title;
	let editedContent = note.content;

	// Function to handle enhanced form submission
	function handleUpdate(result: any) {
		if (result.type === "success") {
			toast.success("Note updated successfully!");
			note.title = editedTitle;
			note.content = editedContent;
			isEditing = false;
		} else {
			toast.error(
				`Error updating note: ${result.data.error || "Unknown error"}`,
			);
		}
	}

	function handleDelete(result: any) {
		if (result.type === "success") {
			toast.success("Note deleted successfully!");
			goto("/notes");
		} else {
			toast.error(
				`Error deleting note: ${result.data.error || "Unknown error"}`,
			);
		}
	}
	function backToPreviousPage() {
		window.history.back();
	}
</script>

<!-- Go back to notebooks button -->
<div class="p-6 flex flex-row place-items-center justify-between">
	<Button variant="outline" on:click={backToPreviousPage}>
		<Icon icon="material-symbols:chevron-left" class="h-6 w-6 mr-2" />
		Back
	</Button>
	<div class="flex flex-row gap-2">
		<Button on:click={() => (settingsModal = true)}>
			<Icon icon="bx:bx-dots-vertical-rounded" class="w-6 h-6" />
		</Button>
	</div>
</div>

<Modal bind:open={settingsModal} title="Lions Mane" description="">
	<!-- Delete button -->
	<div class="p-6">
		<form
			action="?/deleteNote"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleDelete(result);
				};
			}}
		>
			<input type="hidden" name="id" value={note.id} />
			<Button class="bg-red-600" type="submit">
				<Icon icon="mdi:trash" class="w-6 h-6 mr-2" />
				Delete Note
			</Button>
		</form>
	</div>
</Modal>

<!-- Editable title and content wrapped inside a form -->
<form
	method="POST"
	action="?/updateNote"
	use:enhance={() => {
		return ({ result }) => {
			handleUpdate(result);
		};
	}}
>
	<!-- Hidden input for the note ID -->
	<input type="hidden" name="id" value={note.id} />

	<!-- Editable Title -->
	<div class="p-6 text-5xl">
		<div
			contenteditable="true"
			bind:innerHTML={editedTitle}
			class="editable-title p-4 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
			on:input={() => (isEditing = true)}
		></div>
		<input type="hidden" name="title" bind:value={editedTitle} />
	</div>

	<!-- Editable Content -->
	<div class="px-6 text-2xl">
		<div
			contenteditable="true"
			bind:innerHTML={editedContent}
			class="editable-content p-4 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
			on:input={() => (isEditing = true)}
		></div>
		<input type="hidden" name="content" bind:value={editedContent} />
	</div>

	<!-- Save button that appears only when title or content is edited -->
	{#if isEditing}
		<div class="p-6">
			<Button variant="default" type="submit">
				<Icon icon="carbon:save" class="w-6 h-6 mr-2" />
				Save Changes
			</Button>
		</div>
	{/if}
</form>

<style>
	.editable-title,
	.editable-content {
		white-space: pre-wrap;
		word-wrap: break-word;
		min-height: 40px;
	}

	.editable-content {
		min-height: 100px;
	}
</style>
