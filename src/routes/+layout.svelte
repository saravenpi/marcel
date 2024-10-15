<script>
	import "../app.css";
	import { Toaster } from "$lib/components/ui/sonner";
	import { beforeNavigate, afterNavigate } from "$app/navigation";
	import Loading from "$lib/components/Loading.svelte";

	let isLoading = false;

	beforeNavigate(() => {
		isLoading = true;
	});

	afterNavigate(() => {
		isLoading = false;
	});
</script>

<Toaster />

{#if isLoading}
	<Loading message="" />
{:else}
	<slot />
{/if}
