<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Icon from "@iconify/svelte";
	import CreateNotebookModal from "./CreateNotebookModal.svelte";
	import type { NotebookType, User } from "$lib/types";
	import NotebookList from "./NotebookList.svelte";
	import { Separator } from "$lib/components/ui/separator";

	export let data: { user: User; notebooks: NotebookType[] };

	let notebooks = data.notebooks;
	console.log(notebooks);

	let modal = false;
</script>

<CreateNotebookModal bind:open={modal} bind:notebooks />

<div class="flex flex-row justify-between place-items-center">
	<div class="text-3xl flex flex-row place-items-center gap-2">
		<Icon icon="carbon:notebook" class="size-7" />
		<span> Notebooks</span>
	</div>
	<Button
		on:click={() => {
			modal = true;
		}}
	>
		<Icon icon="carbon:add" class="w-6 h-6 md:mr-2" />
		<span class="hidden md:flex">New Notebook</span>
	</Button>
</div>

<Separator class="mt-6" />
<NotebookList {notebooks} />
