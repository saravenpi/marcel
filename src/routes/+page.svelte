<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import type { User } from "$lib/types";

	export let data: { user: User };
</script>

<div class="w-full h-screen" id="bg">
	<div class="w-full top-0 fixed flex p-6 justify-between">
		<span class="text-4xl text-white font-bold">🧘 Marcel</span>

		{#if data.user}
			<div class="flex flex-row gap-2 place-items-center">
				<Button href="/events" class="bg-white text-black hover:text-white"
					>Open App</Button
				>
			</div>
		{:else}
			<div class="flex flex-row gap-2">
				<Button href="/login" class="bg-white text-black hover:text-white">Login</Button>
				<Button href="/register" class="bg-white text-black hover:text-white"
					>Register</Button
				>
			</div>
		{/if}
	</div>
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
		</div>
	</div>
</div>

<style>
	#bg {
		background: linear-gradient(270deg, #eeaeca, #94bbe9, #9571e4);
		background-size: 600% 600%;

		-webkit-animation: AnimationName 11s ease infinite;
		-moz-animation: AnimationName 11s ease infinite;
		animation: AnimationName 11s ease infinite;
	}

	@-webkit-keyframes AnimationName {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	@-moz-keyframes AnimationName {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	@keyframes AnimationName {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
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
