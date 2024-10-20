<script lang="ts">
	import Notebook from "$lib/components/Notebook.svelte";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	import type { NotebookType } from "$lib/types";

	export let notebooks: NotebookType[] = [];
</script>

{#if notebooks.length > 0}
	<ScrollArea class="w-full py-10 ">
		<div class="flex flex-col gap-3">
			{#each notebooks as notebook}
				<Notebook {notebook} />
			{/each}
		</div>
	</ScrollArea>
{:else}
	<div class="text-center p-6">No notebooks found</div>
{/if}
