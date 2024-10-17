<script lang="ts">
	import Navbar from "$lib/components/Navbar.svelte";
	import MobileNavbar from "$lib/components/MobileNavbar.svelte";
	import { Button } from "$lib/components/ui/button";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";

	let mobile = false;
	let mobileNavOpen = false;
	let windowSize: number;

	$: mobile = windowSize < 1024;

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
</script>

<svelte:window bind:innerWidth={windowSize} />

{#if mobile}
	<!-- nav (unchanged) -->
	<div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
		<Button
			on:click={() => (mobileNavOpen = !mobileNavOpen)}
			class="rounded-lg shadow-lg"
		>
			<Icon
				icon={mobileNavOpen ? "heroicons:x-mark" : "heroicons:bars-3"}
				class="size-6"
			/>
			<span class="ml-2">{mobileNavOpen ? "Close" : "Menu"}</span>
		</Button>
	</div>
{:else}
	<Navbar />
{/if}

<MobileNavbar bind:open={mobileNavOpen} avatarUrl="" />
<div class="p-6">
	<slot />
</div>
