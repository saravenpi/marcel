<script lang="ts">
	import Button from "./ui/button/button.svelte";
	import { page } from "$app/stores"; // Import the page store
	import Icon from "@iconify/svelte";

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
		<Button
			href="/events"
			variant={activePath === "/events" ? "default" : "outline"}
			class="flex flex-row gap-2"
		>
			<Icon icon="heroicons:calendar" class="size-5" />
			Events
		</Button>
		<Button
			href="/todos"
			variant={activePath === "/todos" ? "default" : "outline"}
			class="flex flex-row gap-2"
		>
			<Icon icon="heroicons:check-circle" class="size-5" />
			Todos
		</Button>
		<Button
			href="/settings"
			variant={activePath === "/settings" ? "default" : "outline"}
			class="flex flex-row gap-2"
		>
			<Icon icon="heroicons:cog" class="size-5" />
			Settings
		</Button>
	</div>
</div>
