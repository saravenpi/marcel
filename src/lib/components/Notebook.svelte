<script lang="ts">
	import type { NotebookType } from "$lib/types";
	import Icon from "@iconify/svelte";

	export let notebook: NotebookType;
</script>

<a href={"/notebooks/" + notebook.id}>
	<div
		class="flex flex-row justify-between place-items-center rounded-xl p-5 container"
	>
		<div class="flex flex-col md:flex-row place-items-center gap-2">
			<span class="text-2xl text-black dark:text-white">
				{notebook.name}</span
			>
			<span class="text-xl description hidden md:flex"
				>{notebook.notes.length} note{notebook.notes.length > 1
					? "s"
					: ""}</span
			>
			<Icon
				icon="material-symbols:circle"
				class="h-2 w-2 description hidden md:flex"
			/>
			<span class="text-xl description hidden md:flex"
				>{notebook.ressources.length} ressource{notebook.ressources
					.length > 1
					? "s"
					: ""}</span
			>
		</div>
		<Icon icon="material-symbols:chevron-right" class="h-6 w-6" />
	</div>
</a>
