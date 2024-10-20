<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { type NoteType, type User } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import Note from "$lib/components/Note.svelte";
	import CreateNoteModal from "./CreateNoteModal.svelte";
	export let data: { notes: NoteType[]; user: User };

	let notes: NoteType[] = data.notes;
	let modal = false;

	// Function to destroy note by id
	function destroyNote(todoId: string) {
		notes = notes.filter((todo) => todo.id !== todoId);
	}
</script>

<CreateNoteModal {modal} {notes} />
<div class="flex flex-col gap-6">
	<div class="w-full flex flex-row justify-between">
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="material-symbols:note" class="size-7" />
			Notes</span
		>
		<Button on:click={() => (modal = true)} class="flex flex-row gap-2">
			<Icon icon="heroicons:plus" class="size-5" />
			<span class="hidden md:flex">Create note</span>
		</Button>
	</div>

	{#if notes && notes.length > 0}
		<ScrollArea orientation="vertical" class="mb-[60px]">
			<div class="flex flex-col gap-4">
				{#each notes as note}
					<Note {note} destroy={destroyNote} displayBadge={true} />
				{/each}
			</div>
		</ScrollArea>
	{:else}
		<div class="text-center">No notes found</div>
	{/if}
</div>
