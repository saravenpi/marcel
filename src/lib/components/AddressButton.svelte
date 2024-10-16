<script lang="ts">
	import AutoComplete from "./AutoComplete.svelte";

	export let address: string = "";

	let autocompleteData: any[] = [];
	export let finalAddress = "";
	let debounceTimeout: any = null;
	const debounceDelay = 300;

	function onAddressChange(event: string): void {
		console.log("Address changed to:", event);
	}

	$: if (address) {
		handleAddressChange();
	}

	function handleAddressChange(): void {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		debounceTimeout = setTimeout(() => {
			if (address.trim() === "") {
				autocompleteData = [];
				return;
			}

			autocompleteData = [];
			fetch("/api/address/autocomplete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ address }),
			})
				.then((response) => response.json())
				.then((data) => {
					let id = 0;
					let newAutoCompleteData: any[] = [];

					if (data.data.length === 0) return;
					data.data.forEach((place: any) => {
						let label = place.address;
						let value = place.address;
						newAutoCompleteData.push({ label, value, id });
						id++;
					});
					autocompleteData = [...newAutoCompleteData];
				})
				.catch((error) => {
					console.error("Error fetching autocomplete data:", error);
				});
		}, debounceDelay);
	}
</script>

<!-- Your existing Autocomplete component usage -->
<AutoComplete
	icon="mdi:location"
	bind:data={autocompleteData}
	label="place"
	bind:value={address}
	onChangeHandler={onAddressChange}
	bind:finalValue={finalAddress}
/>
