<script lang="ts">
	import { type NoteType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { Badge } from "./ui/badge";

	export let note: NoteType;
	export let displayBadge: boolean = false;
	export let destroy: (eventId: string) => void;
</script>

<a href={"/notes/" + note.id}>
	<div
		class="container rounded-xl flex flex-row p-4 justify-between place-items-center"
	>
		<div class="flex flex-col gap-2">
			<span class="text-2xl">{note.title}</span>
			{#if displayBadge}
				{#if note.notebook}
					<Badge class="w-min">{note.notebook}</Badge>
				{:else}
					<Badge class="w-min">All</Badge>
				{/if}
			{/if}
			<span class="text-md truncate max-w-[200px]">{note.content}</span>
		</div>
		<Icon icon="akar-icons:chevron-right" class="text-2xl" />
	</div>
</a>
