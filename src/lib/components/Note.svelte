<script lang="ts">
	import { type NoteType } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { Badge } from "./ui/badge";

	export let note: NoteType;
	export let displayBadge: boolean = false;
	export let destroy: (eventId: string) => void;
</script>

<a href={"/notes/" + note.id}>
	<div class="container rounded-xl flex flex-col p-4">
		<div class=" flex flex-row justify-between place-items-center">
			<div class="flex flex-row gap-2 place-items-center">
				<span class="text-2xl">{note.title}</span>
				{#if displayBadge}
					{#if note.notebook}
						<Badge>{note.notebook}</Badge>
					{:else}
						<Badge>All</Badge>
					{/if}
				{/if}
			</div>
			<Icon icon="akar-icons:chevron-right" class="text-2xl" />
		</div>
		<span class="text-md truncate max-w-[200px]">{note.content}</span>
	</div>
</a>
