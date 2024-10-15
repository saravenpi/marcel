
import type { PageServerLoad, RequestEvent } from "./$types";
import type { User } from "$lib/types";

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
