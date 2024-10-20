<script lang="ts">
	import { enhance } from "$app/forms";
	import Modal from "$lib/components/Modal.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { toast } from "svelte-sonner";
	import type { RessourceType } from "$lib/types";
	import * as Select from "$lib/components/ui/select/index.js";

	export let open = false;
	export let ressources: RessourceType[] = [];
	export let notebookId: string;

	let selectedRessourceType: any;

	function handleCreate(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			open = false;
			ressources = [...ressources, result.data.data];
		} else {
			toast.error(result.data.error);
		}
	}

	const ressourceTypes = [
		{ value: "video", label: "Youtube video" },
		{ value: "text", label: "Text content" },
		{ value: "pdf", label: "Pdf file" },
	];
</script>

<Modal
	bind:open
	title="Add a ressource"
	description="Add a ressource to your notebook to feed the AI's ressources"
>
	<form
		class="flex flex-col gap-4"
		action="?/createRessource"
		method="POST"
		use:enhance={() => {
			return ({ result }) => {
				handleCreate(result);
			};
		}}
	>
		<div>
			<Label for="type">Type</Label>
			<!-- Select for type of resource -->
			<Select.Root
				onSelectedChange={(v) => {
					v && (selectedRessourceType = v.value);
				}}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select a type" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Ressource types</Select.Label>
						{#each ressourceTypes as ressourceType}
							<Select.Item
								value={ressourceType.value}
								label={ressourceType.label}
							>
								{ressourceType.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<Label for="name">Name</Label>
			<Input
				type="text"
				id="title"
				name="name"
				placeholder="Pick a name for this ressource"
			/>
		</div>
		<div>
			<Label for="content">Content</Label>
			<Input
				type="text"
				id="content"
				name="content"
				placeholder="Add content in this ressource"
			/>
		</div>

		<!-- Hidden input to carry selected resource type -->
		<input type="hidden" name="type" value={selectedRessourceType} />
		<input type="hidden" name="notebookId" value={notebookId} />

		<div>
			<Button type="submit" variant="default">Create Ressource</Button>
		</div>
	</form>
</Modal>
