<script>
	export let message = "Loading...";
</script>

<div class="loading loading-overlay dark:bg-transparent">
	<div class="spinner"></div>
	<p>{message}</p>
</div>

<style>
	/* Basic styling for a spinner */
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-top: 4px solid #000000;
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
