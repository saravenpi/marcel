<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import type { User } from "$lib/types";

	export let data: { user: User };
</script>

<div class="w-full h-screen" id="bg">
	<!-- top bar -->
	<div class="w-full top-0 fixed flex flex-row p-6 justify-between">
		<span class="text-4xl text-white font-bold">🧘 Marcel</span>

		{#if data.user}
			<!-- app button if user is authenticated -->
			<div class="flex flex-row gap-2 place-items-center">
				<Button
					href="/events"
					class="bg-transparent text-white text-xl border border-white"
					variant="outline">Open App</Button
				>
			</div>
		{:else}
			<!-- auth buttons if user is not logged in -->
			<div class="flex flex-row gap-2">
				<Button
					href="/login"
					class="text-white bg-transparent text-xl border border-white"
					variant="outline">Login</Button
				>
			</div>
		{/if}
	</div>

	<!-- center content -->
	<div
		class="-full h-full flex flex-col justify-center place-items-center"
		id="bg"
	>
		<div
			class="rounded flex flex-col gap-6 p-6 bg-transparent backdrop-blur-lg"
		>
			<span>
				<span class="text-5xl text-white">Organise yourself</span>
				<span class="text-5xl header ml-2 font-bold">differently</span>
			</span>
			<Button
				href="/register"
				class="bg-transparent text-white text-xl border border-white"
				>Get Started</Button
			>
		</div>
	</div>
</div>

<style>
	#bg {
		background: linear-gradient(270deg, #eeaeca, #94bbe9, #9571e4);
		background-size: 600% 600%;
		background: #161616;
	}

	.header {
		color: #9571e4;
		background-image: -webkit-linear-gradient(
			92deg,
			#9571e4,
			#5a96de,
			#eeaeca
		);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		-webkit-animation: hue 6s infinite linear;
		animation: hue 6s infinite linear;
	}

	@keyframes hue {
		from {
			filter: hue-rotate(0deg);
		}
		to {
			filter: hue-rotate(-360deg);
		}
	}

	@-webkit-keyframes hue {
		from {
			-webkit-filter: hue-rotate(0deg);
		}
		to {
			-webkit-filter: hue-rotate(-360deg);
		}
	}
</style>
