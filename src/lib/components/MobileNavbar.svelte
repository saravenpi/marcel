<script lang="ts">
	import { page } from "$app/stores";

	import Icon from "@iconify/svelte";
	import { toast } from "svelte-sonner";

	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import * as Avatar from "$lib/components/ui/avatar";

	// variables
	export let open: boolean; // sidebar state
	export let avatarUrl: string;

	let activePath: string;
	$: activePath = $page.url.pathname;

	// methods
	async function handleLogout() {
		open = false;

		try {
			const response = await fetch("/api/logout", { method: "POST" });
			const result = await response.json();
			if (result.success) {
				toast.success("Logout successful");
				window.location.href = "/";
			} else {
				toast.error("Logout failed");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	}
</script>

<main class="w-full h-full">
	<Drawer.Root {open} onOpenChange={() => (open = !open)}>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title class="text-3xl">🧘 Marcel</Drawer.Title>
					<Drawer.Description class="text-xl">Navigation</Drawer.Description>

					{#if avatarUrl}
						<Avatar.Root class="justify-start ml-2 mx-auto size-16">
							<Avatar.Image src={avatarUrl} alt="avatar" />
							<Avatar.Fallback>??</Avatar.Fallback>
						</Avatar.Root>
					{/if}
				</Drawer.Header>

				<div class="center p-5">
					<div class="flex flex-col w-full gap-2 text-2xl">
						<Button
							href="/events"
							variant={activePath === "/events"
								? "default"
								: "outline"}
							class="flex flex-row gap-2"
						>
							<Icon icon="heroicons:calendar" class="size-5" />
							Events
						</Button>
						<Button
							href="/todos"
							variant={activePath === "/todos"
								? "default"
								: "outline"}
							class="flex flex-row gap-2"
						>
							<Icon
								icon="heroicons:check-circle"
								class="size-5"
							/>
							Todos
						</Button>
						<Button
							href="/settings"
							variant={activePath === "/settings"
								? "default"
								: "outline"}
							class="flex flex-row gap-2"
						>
							<Icon icon="heroicons:cog" class="size-5" />
							Settings
						</Button>
					</div>
				</div>

				<Separator class="w-64 mx-auto" />

				<Drawer.Footer>
					<Button
						variant="ghost"
						on:click={handleLogout}
						class={open
							? "bg-red-600 bg-opacity-80 w-[80%] mx-auto"
							: "justify-start w-full bg-red-600 bg-opacity-80"}
					>
						<div class="flex items-center gap-2">
							<Icon
								icon="material-symbols:logout"
								class="size-6"
							/>
							Logout
						</div>
					</Button>

					<Drawer.Close asChild let:builder>
						<Button
							builders={[builder]}
							class="w-[80%] mx-auto gap-2"
						>
							<Icon
								icon={open
									? "heroicons:x-mark"
									: "heroicons:bars-3"}
								class="size-6"
							/>
							Close
						</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</div>
		</Drawer.Content>
	</Drawer.Root>
</main>
