import type { PageServerLoad, RequestEvent } from "./$types";
import { ERROR_RESPONSE } from "$lib/response";
import { PB_URL } from '$env/static/private';
import PocketBase from "pocketbase";
import type { ServerResponse, User } from "$lib/types";
import { logout } from '$lib/auth'

let client = new PocketBase(PB_URL);


export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		// Fetch the user from the locals
		const user: User | null = event.locals.user;

		// Ensure the user exists
		if (!user) {
			return {
				user: null,
				error: "User not found"
			}
		}

		// Return the user and todos
		return {
			user,
		};
	} catch (error) {
		console.error("Failed to load data:", error);
		// Optionally, you can handle the error gracefully by returning an empty list or an error message
		return {
			user: event.locals.user,
			error: "Failed to load todos"
		};
	}
};

export const actions = {
	deleteUser: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			// Fetch the user from the locals
			const user: User | null = event.locals.user;

			// Ensure the user exists
			if (!user) {
				return ERROR_RESPONSE("User not found.");
			}

			console.log("Deleting user account:", user.id);
			client.authStore.loadFromCookie(event.cookies.get("pbUser") as string);
			if (!client.authStore.isValid) {
				return ERROR_RESPONSE("User not found.");
			}

			// Attempt to delete the user account
			const deletionResult = await client.collection("users").delete(user.id)
			console.log(deletionResult)

			// Check if the deletion was successful
			if (deletionResult) {
				// Optionally, you can log the user out by clearing the auth store
				client.authStore.clear();
				return logout(event.cookies);
			} else {
				return ERROR_RESPONSE("Failed to delete the user account.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error deleting user account:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`User account deletion failed: ${message}`);
		}
	}
}
