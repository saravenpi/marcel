<script>
	import { onMount } from "svelte";

	export let message = "Loading...";
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

<div class="loading loading-overlay dark:bg-transparent">
	<div class="spinner text-5xl">🧘</div>
	<p>{message}</p>
</div>

<style>
	.spinner {
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
</style>
