<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { enhance } from "$app/forms";
	import Check from "lucide-svelte/icons/check";
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { tick } from "svelte";
	import { cn } from "$lib/utils.js";
	import Icon from "@iconify/svelte";

	// variables
	let open = false;

	export let label: string = "label";
	export let data: Array<{ label: string; value: string; id: string }>;
	export let icon: string | undefined;

	export let value: string = "";
	export let formAction: string | undefined = undefined;
	export let finalValue: string | undefined = undefined;
	export let onChangeHandler: (event: any) => void;

	const dispatch = createEventDispatcher();

	let formElement: HTMLFormElement;
	let debounceTimer: ReturnType<typeof setTimeout>;

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function handleSelect(selectedId: string, triggerId: string) {
		finalValue = data.find((f) => f.id === selectedId)?.value ?? "";
		value = data.find((f) => f.id === selectedId)?.value ?? "";
		closeAndFocusTrigger(triggerId);
		debouncedSubmit();
	}

	function debouncedSubmit() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			if (value && formElement && formAction) {
				formElement.requestSubmit();
			} else if (value) {
				dispatch("select", { value });
			}
		}, 300); // 300ms debounce
	}

	function handleSubmit(event: any) {
		const { result } = event.detail;
		if (result.type === "success") {
			dispatch("formSubmit", { result: result.data });
		} else {
			dispatch("formError", { error: result.data });
		}
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="justify-between w-full truncate"
		>
			<div class="flex flex-row place-items-center">
				{#if icon}
					{#if !finalValue}
						<Icon
							{icon}
							class="mr-2 h-4 w-4 text-muted-foreground"
						/>
					{:else}
						<Icon {icon} class="mr-2 h-4 w-4" />
					{/if}
				{/if}
				{#if !finalValue}
					<span class="text-muted-foreground"
						>Select a {label}...</span
					>
				{:else}
					{value}
				{/if}
			</div>
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="p-2 mt-2 fixed">
		<Command.Root>
			<Command.Input
				placeholder="Search {label}s ..."
				class="m-2"
				on:change={(event) => onChangeHandler(event)}
				bind:value
			/>
			<Command.Empty>No {label} found.</Command.Empty>
			<div class="max-h-[160px] overflow-y-auto">
				<Command.Group>
					{#each data as item}
						<Command.Item
							value={item.value}
							onSelect={() => handleSelect(item.id, ids.trigger)}
						>
							<Check
								class={cn(
									"mr-2 h-4 w-4",
									value !== item.id && "text-transparent",
								)}
							/>
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</div>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

{#if formAction}
	<form
		bind:this={formElement}
		method="POST"
		action={formAction}
		use:enhance={() => {
			return ({ result }) => {
				handleSubmit(result);
			};
		}}
		class="hidden"
	>
		<input type="hidden" name="value" {value} />
	</form>
{/if}

<style>
	:global(.overflow-y-auto) {
		overflow-y: auto;
	}
</style>
