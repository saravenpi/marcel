<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import type { User } from "$lib/types";
	import Icon from "@iconify/svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	export let data: { user: User };

	let isDarkMode = false;

	let modal = false;

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
	// function to handle add todo server result
	function handleDelete(result: any) {
		if (result.data && result.data.success) {
			toast.success("Account deleted successfully!");
			modal = false;
			goto("/");
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<div class="flex flex-col gap-6">
	<!-- Header -->
	<div class="w-full flex flex-row justify-between">
		<span class="text-3xl flex flex-row place-items-center gap-2">
			<Icon icon="heroicons:cog" class="size-7" />
			Settings</span
		>
	</div>

	<!-- Settings card -->
	<div
		class="flex flex-col rounded-xl p-4 bg-neutral-100 dark:bg-[#161616] gap-6"
	>
		<!-- Profile information -->
		{#if data.user}
			<span class="text-2xl p-2">My profile</span>
			<div class="p-3 flex flex-col gap-2">
				<Label for="email">Email</Label>
				<span class="text-sm md:text-lg p-2">{data.user.email}</span>
				<Label for="email">Username</Label>
				<span class="text-sm md:text-lg p-2">{data.user.username}</span>
			</div>
		{/if}

		<!-- Buttons -->
		<div class="flex flex-col gap-3">
			<!-- Theme toggle -->
			<Button on:click={toggleTheme} class="flex flex-row gap-2 w-min">
				<Icon
					icon={isDarkMode ? "heroicons:sun" : "heroicons:moon"}
					class="size-5"
				/>
				{isDarkMode ? "Light mode" : "Dark mode"}
			</Button>
			<LogoutButton />
		</div>

		<!-- Danger zone -->
		<div class="flex flex-col gap-3 rounded-xl border-red-500 border p-6">
			<span class="text-2xl text-red-500">Danger zone</span>

			<!-- Delete acccount button -->

			<Button
				on:click={() => (modal = true)}
				class="flex flex-row gap-2 w-min bg-red-600"
			>
				<Icon icon="heroicons:trash" class="size-5" />
				Delete account
			</Button>
		</div>
	</div>
</div>

<Modal
	bind:open={modal}
	title="Delete your account"
	description="It will delete all your data from Marcel"
>
	<form
		action="?/deleteUser"
		method="POST"
		use:enhance={() => {
			return ({ result }) => {
				handleDelete(result);
			};
		}}
	>
		<Button type="submit" class="flex flex-row gap-2 w-full bg-red-600">
			<Icon icon="heroicons:trash" class="size-5" />
			Delete account
		</Button>
	</form>
</Modal>
