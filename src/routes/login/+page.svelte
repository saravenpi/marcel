<script lang="ts">
	import { enhance } from "$app/forms";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button/";
	import { toast } from "svelte-sonner";

	let email: string = "";
	let password: string = "";

	function handleLogin(result: any) {
		if (result.data && result.data.success) {
			toast.success(result.data.message);
			window.location.href = "/events";
		} else {
			toast.error(result.data.error);
		}
	}
</script>

<div class="flex w-full justify-center place-items-center h-screen" id="bg">
	<div class="rounded w-[500px] p-10 bg-transparent backdrop-blur-xl">
		<div class="text-4xl mb-6 text-white">Login</div>
		<form
			action="?/login"
			method="POST"
			use:enhance={() => {
				return ({ result }) => {
					handleLogin(result);
				};
			}}
		>
			<div class="flex flex-col gap-6">
				<Input
					type="email"
					name="email"
					value={email}
					placeholder="Email"
				/>
				<Input
					type="password"
					name="password"
					value={password}
					placeholder="Password"
				/>
				<Button type="submit">Login</Button>
				<span class="text-lg text-white">
					Do you want to <a
						class="text-white font-semibold underline"
						href="/register"
					>
						Register
					</a> instead?
				</span>
			</div>
		</form>
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
</style>
