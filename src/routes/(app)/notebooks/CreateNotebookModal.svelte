<script lang="ts">
	import { enhance } from "$app/forms";
	import Modal from "$lib/components/Modal.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Textarea } from "$lib/components/ui/textarea";
	import { toast } from "svelte-sonner";
	import type { NotebookType } from "$lib/types";

	export let open = false;
	export let notebooks: NotebookType[] = [];

	function handleCreate(result: any) {
		if (result.data && result.data.success) {
			toast.success("Notebook created successfully!");
			open = false;
			notebooks = [...notebooks, result.data.data];
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<Modal bind:open title="Create a new notebook" description="">
	<form
		class="flex flex-col gap-4"
		action="?/createNotebook"
		method="POST"
		use:enhance={() => {
			return ({ result }) => {
				handleCreate(result);
			};
		}}
	>
		<div>
			<Label for="name">Name</Label>
			<Input type="text" id="name" name="name" />
		</div>
		<div>
			<Label for="description">Description</Label>
			<Textarea id="description" name="description"></Textarea>
		</div>
		<div>
			<Button type="submit" variant="default">Create Notebook</Button>
		</div>
	</form>
</Modal>
