<script lang="ts">
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import type { NotebookType, NoteType, RessourceType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import CreateRessourceModal from "./CreateRessourceModal.svelte";
	import CreateNoteModal from "./CreateNoteModal.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import Note from "$lib/components/Note.svelte";
	import Ressource from "$lib/components/Ressource.svelte";
	import { Separator } from "$lib/components/ui/separator";

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

	let summary = "Loading summary..."; // Initially, loading state for the summary

	// Fetch the AI summary when the component is mounted
	onMount(async () => {
		try {
			const url = `/api/summary`;
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					ressources: ressources,
				}),
			});

			if (response.ok) {
				const result = await response.json();
				summary = result.summary || "No summary available.";
			} else {
				summary = "Failed to load summary.";
			}
		} catch (error) {
			console.error("Error fetching summary:", error);
			summary = "Error fetching summary.";
		}
	});

	// Function to destroy note by id
	function destroyNote(noteId: string) {
		notes = notes.filter((note) => note.id !== noteId);
	}

	// Function to destroy note by id
	function destroyRessource(ressourceId: string) {
		ressources = ressources.filter(
			(ressource) => ressource.id !== ressourceId,
		);
	}
</script>

<!-- Go back to notebooks button -->
<CreateRessourceModal
	bind:open={ressourceModal}
	notebookId={notebook.id}
	bind:ressources
/>
<CreateNoteModal bind:open={noteModal} notebookId={notebook.id} bind:notes />

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

	<!-- Description -->
	<div class="px-6 text-2xl pb-6 description">{notebook.description}</div>

	<Separator class="mb-6" />
	<!-- AI Summary -->
	<!-- <div class="px-6 text-3xl pb-6">AI Summary</div> -->
	<!-- <div class="px-6 text-2xl pb-6">{summary}</div> -->

	<!-- Notes -->
	{#if notes && notes.length > 0}
		<div class="flex flex-row place-items-center gap-2">
			<div class="flex flex-row gap-2 place-items-center">
				<Icon icon="material-symbols:note" class="size-7" />
				<span class="text-3xl">Notes</span>
			</div>
			<span class="text-neutral-600 dark:text-neutral-200 text-lg"
				>{notes.length} found</span
			>
		</div>
		<ScrollArea orientation="vertical" class="mb-[60px]">
			<div class="flex flex-col gap-4 p-3">
				{#each notes as note}
					<Note {note} destroy={destroyNote} />
				{/each}
			</div>
		</ScrollArea>
	{/if}

	<!-- Ressources -->
	{#if ressources && ressources.length > 0}
		<div class=" flex flex-row place-items-center gap-2">
			<div class="flex flex-row gap-2 place-items-center">
				<Icon icon="material-symbols:link" class="size-7" />
				<span class="text-3xl">Ressources</span>
			</div>
			<span class="text-neutral-600 dark:text-neutral-200 text-lg"
				>{ressources.length} found</span
			>
		</div>
		<ScrollArea orientation="vertical" class="mb-[60px]">
			<div class="flex flex-col gap-4 p-3">
				{#each ressources as ressource}
					<Ressource
						{ressource}
						destroy={destroyRessource}
						notebookId={notebook.id}
					/>
				{/each}
			</div>
		</ScrollArea>
	{/if}
</div>
