<script lang="ts">
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import type { User } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	export let data: { user: User };

	let isDarkMode = false;

	onMount(() => {
		// Check localStorage for a saved theme or use system preference
		isDarkMode =
			localStorage.getItem("theme") === "dark" ||
			(!localStorage.getItem("theme") &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);

		// Update the theme based on the stored or system preference
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	});

	// Toggle the theme and save the preference
	function toggleTheme() {
		isDarkMode = !isDarkMode;
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div class="w-full flex flex-row justify-between">
		<span class="text-3xl">Settings</span>
	</div>
	<div class="flex flex-col rounded border p-3">
		<span class="text-2xl p-2">User Info</span>
		<div class="p-3 flex flex-col gap-2">
			<Label for="email">Email</Label>
			<span class="text-lg p-2">{data.user.email}</span>
			<Label for="email">Username</Label>
			<span class="text-lg p-2">{data.user.username}</span>
		</div>

		<div class="flex flex-col gap-3">
			<Button on:click={toggleTheme} class="flex flex-row gap-2 w-min">
				<Icon
					icon={isDarkMode ? "heroicons:sun" : "heroicons:moon"}
					class="size-5"
				/>
				{isDarkMode ? "Light mode" : "Dark mode"}
			</Button>
			<LogoutButton />
		</div>
	</div>
</div>
