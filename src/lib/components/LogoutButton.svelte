<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";
	import type { ServerResponse } from "$lib/types";
	import Icon from "@iconify/svelte";

	async function handleLogout() {
		try {
			const response = await fetch("/api/logout", { method: "POST" });
			const result: ServerResponse = await response.json();

			if (result.success) {
				toast.success(result.message);
				window.location.href = "/";
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later !");
		}
	}
</script>

<Button
	on:click={handleLogout}
	class="text-white bg-red-500 w-min flex flex-row gap-2 hover:bg-red-300"
>
	<Icon icon="material-symbols:logout" class="size-5" />
	Logout
</Button>
