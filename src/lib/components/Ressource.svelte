<script lang="ts">
	import { enhance } from "$app/forms";
	import { type RessourceType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { Badge } from "./ui/badge";
	import { Button } from "./ui/button";
	import Modal from "./Modal.svelte";
	import { toast } from "svelte-sonner";
	import { Label } from "./ui/label";

	export let ressource: RessourceType;
	export let notebookId: string;
	export let destroy: (ressourceId: string) => void;
	export let modal = false;

	function handleDelete(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			destroy(ressource.id);
		} else {
			toast.error(result.data.error);
		}
	}
	function handleUpdate(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			modal = false;
			ressource = result.data.data;
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal
	bind:open={modal}
	title={ressource.name}
	description="This ressource is currently used by the AI"
>
	<div class="flex flex-col gap-3 w-full">
		<Label for="type">Type</Label>
		<Badge class="w-min">{ressource.type}</Badge>
		<Label for="content">Content</Label>
		{#if ressource.type == "video"}
			<a href={ressource.content} class="underline">{ressource.content}</a
			>
		{:else}
			<span>{ressource.content}</span>
		{/if}
		<form
			action="?/updateRessource"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleUpdate(result);
				};
			}}
		>
			<input type="hidden" name="ressourceId" value={ressource.id} />
		</form>

		<form
			action="?/deleteRessource"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleDelete(result);
				};
			}}
		>
			<input type="hidden" name="ressourceId" value={ressource.id} />
			<input type="hidden" name="notebookId" value={notebookId} />
			<Button
				class="flex flex-row gap-2 w-full"
				variant="outline"
				type="submit"
			>
				<Icon icon="heroicons:trash" class="size-5" />
				Delete
			</Button>
		</form>
	</div>
</Modal>

<div
	class="container p-4 rounded-xl flex flex-row justify-between place-items-center"
>
	<div>
		<div class="flex flex-row gap-2 place-items-center">
			<span class="text-2xl truncate max-w-[200px]">{ressource.name}</span
			>
			<Badge>{ressource.type}</Badge>
		</div>
		{#if ressource.type == "video"}
			<a
				class="hidden md:flex text-md truncate max-w-[200px] text-blue-300 underline"
				href={ressource.content}
				target="_blank">{ressource.content}</a
			>
		{:else}
			<span class="hidden md:flextext-md truncate max-w-[200px]"
				>{ressource.content}</span
			>
		{/if}
	</div>
	<Button
		class="p-0 bg-transparent text-black dark:text-white"
		on:click={() => {
			modal = true;
		}}
	>
		<Icon icon="carbon:overflow-menu-horizontal" class="w-6 h-6" />
	</Button>
</div>
