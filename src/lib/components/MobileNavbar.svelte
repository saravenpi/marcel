<script lang="ts">
	import { page } from "$app/stores";

	import Icon from "@iconify/svelte";

	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Separator } from "$lib/components/ui/separator";
	import * as Avatar from "$lib/components/ui/avatar";
	import pages from "$lib/pages";

	// variables
	export let open: boolean;
	export let avatarUrl: string;

	let activePath: string;
	$: activePath = $page.url.pathname;
</script>

<main class="w-full h-full">
	<Drawer.Root {open} onOpenChange={() => (open = !open)}>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title class="text-3xl text-center">
						<a href="/">🧘 Marcel</a>
					</Drawer.Title>

					{#if avatarUrl}
						<Avatar.Root class="justify-start ml-2 mx-auto size-16">
							<Avatar.Image src={avatarUrl} alt="avatar" />
							<Avatar.Fallback>??</Avatar.Fallback>
						</Avatar.Root>
					{/if}
				</Drawer.Header>

				<div class="center p-5">
					<div class="flex flex-col w-full gap-2 text-2xl">
						{#each pages as { href, icon, label }}
							<Button
								{href}
								variant={activePath === href
									? "default"
									: "outline"}
								class="flex flex-row gap-2"
							>
								<Icon {icon} class="size-5" />
								{label}
							</Button>
						{/each}
					</div>
				</div>

				<Separator class="w-64 mx-auto" />

				<Drawer.Footer>
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
