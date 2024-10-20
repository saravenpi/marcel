<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { NotebookType, NoteType, RessourceType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import CreateRessourceModal from "./CreateRessourceModal.svelte";
	import CreateNoteModal from "./CreateNoteModal.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import Note from "$lib/components/Note.svelte";
	import ResizableHandle from "$lib/components/ui/resizable/resizable-handle.svelte";
	import Ressource from "$lib/components/Ressource.svelte";

	export let data: {
		notebook: NotebookType;
		notes: NoteType[];
		ressources: RessourceType[];
	};

	let notebook = data.notebook;
	let notes = data.notes;
	let ressources = data.ressources;

	let noteModal = false;
	let ressourceModal = false;

	// Function to destroy note by id
	function destroyNote(noteId: string) {
		notes = notes.filter((note) => note.id !== noteId);
	}
</script>

<!-- Go back to notebooks button -->
<CreateRessourceModal bind:open={ressourceModal} notebookId={notebook.id} />
<CreateNoteModal bind:open={noteModal} notebookId={notebook.id} />

<div class="p-6 flex flex-row place-items-center justify-between">
	<a href="/notebooks">
		<Button variant="outline">
			<Icon
				icon="material-symbols:chevron-left"
				class="h-6 w-6 md:mr-2"
			/>
			<span class="hidden md:flex">Back to Notebooks</span>
		</Button>
	</a>
	<div class="flex flex-row gap-3">
		<Button variant="default" on:click={() => (noteModal = true)}>
			<Icon
				icon="material-symbols:note-add-outline"
				class="w-6 h-6 md:mr-2"
			/>
			<span class="hidden md:flex">Add Note</span>
		</Button>
		<Button variant="default" on:click={() => (ressourceModal = true)}>
			<Icon icon="material-symbols:add-link" class="w-6 h-6 md:mr-2" />
			<span class="hidden md:flex">Add ressource</span>
		</Button>
	</div>
</div>

<!-- Notes -->
<div class="p-6">
	<!-- Name -->
	<div class="text-5xl pb-6 place-items-center flex flex-row gap-3">
		<Icon icon="carbon:notebook" class="w-12 h-12 inline-block" />
		<span>{notebook.name}</span>
	</div>

	<!-- Desription -->
	<div class="px-6 text-2xl pb-6">{notebook.description}</div>

	<!-- Notes -->
	{#if notes && notes.length > 0}
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="material-symbols:note" class="size-7" />
			Notes
		</span>
		<ScrollArea orientation="vertical" class="mb-[60px]">
			<div class="flex flex-col gap-4 p-3">
				{#each notes as note}
					<Note {note} destroy={destroyNote} />
				{/each}
			</div>
		</ScrollArea>
	{:else}
		<div class="text-center">No notes found</div>
	{/if}

	<!-- Ressources -->
	{#if notes && notes.length > 0}
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="material-symbols:link" class="size-7" />
			Ressources
		</span>
		<ScrollArea orientation="vertical" class="mb-[60px]">
			<div class="flex flex-col gap-4 p-3">
				{#each ressources as ressource}
					<Ressource {ressource} />
				{/each}
			</div>
		</ScrollArea>
	{:else}
		<div class="text-center">No notes found</div>
	{/if}
</div>
