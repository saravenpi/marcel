<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Button } from "$lib/components/ui/button";
	import Icon from "@iconify/svelte";

	// variables
	export let open: boolean = false;
	export let title: string = "title";
	export let description: string = "description";

	let windowsize: number;
	let mobile: boolean = false;

	$: mobile = windowsize < 1024;
</script>

<svelte:window bind:innerWidth={windowsize} />

{#if mobile}
	<Drawer.Root {open} onOpenChange={() => (open = !open)}>
		<Drawer.Content>
			<div class="mx-auto w-full max-w-sm">
				<Drawer.Header>
					<Drawer.Title class="text-2xl">{title}</Drawer.Title>
					<Drawer.Description class="text-xl">
						{description}
					</Drawer.Description>
				</Drawer.Header>

				<div class="">
					<slot />
				</div>

				<!-- <Separator class="w-64 mx-auto" /> -->

				<Drawer.Footer class="mt-4">
					<Drawer.Close aschild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							class="gap-2"
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
{:else}
	<Dialog.Root {open} onOpenChange={() => (open = !open)}>
		<Dialog.Content>
			<div class="mx-auto w-full max-w-sm p-4 my-8">
				<Dialog.Header>
					<Dialog.Title class="text-2xl">{title}</Dialog.Title>
					<Dialog.Description class="text-xl">
						{description}
					</Dialog.Description>
				</Dialog.Header>

				<div class="center mt-4">
					<slot />
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
