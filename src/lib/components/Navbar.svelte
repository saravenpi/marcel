<script lang="ts">
	import Button from "./ui/button/button.svelte";
	import { page } from "$app/stores"; // Import the page store
	import Icon from "@iconify/svelte";
	import pages from "$lib/pages";

	let activePath = $page.url.pathname; // Get the current pathname
</script>

<div class="flex flex-row justify-between p-6">
	<div>
		<a href="/">
			<span class="text-4xl text-black dark:text-white font-bold"
				>🧘 Marcel</span
			>
		</a>
	</div>
	<div class="flex flex-row gap-3">
		{#each pages as { href, icon, label }}
			<Button
				{href}
				variant={activePath === href ? "default" : "outline"}
				class="flex flex-row gap-2"
			>
				<Icon {icon} class="size-5" />
				{label}
			</Button>
		{/each}
	</div>
</div>
