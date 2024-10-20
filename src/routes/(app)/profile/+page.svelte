<script lang="ts">
	import type { User } from "$lib/types";

	export let data: { user: User };
	let user: User = data.user;
</script>

<div class="p-6">
	<div class="text-4xl">{user.username}</div>
</div>
