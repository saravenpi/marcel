<script lang="ts">
	import { type RessourceType } from "$lib/types";
	import { Badge } from "./ui/badge";

	export let ressource: RessourceType;
</script>

<div class="container p-4 rounded-xl flex flex-col justify-between">
	<div class="flex flex-row gap-2 place-items-center">
		<span class="text-2xl truncate max-w-[200px]">{ressource.name}</span>
		<Badge class="text-md text-neutral-200">{ressource.type}</Badge>
	</div>
	{#if ressource.type == "video"}
		<a
			class="text-md truncate max-w-[200px] text-blue-300"
			href={ressource.content}
			target="_blank">{ressource.content}</a
		>
	{:else}
		<span class="text-md truncate max-w-[200px]">{ressource.content}</span>
	{/if}
</div>
