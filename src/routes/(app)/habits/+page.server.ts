import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "$lib/response";
import { PB_URL } from '$env/static/private';
import PocketBase from "pocketbase";
import type { PageServerLoad, RequestEvent } from "./$types";
import type { ServerResponse, User, HabitType } from "$lib/types";

let client = new PocketBase(PB_URL);

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		// Fetch the user from the locals
		const user: User | null = event.locals.user;

		// Ensure the user exists
		if (!user) {
			return {
				user: null,
				habits: [],
				error: "User not found"
			};
		}

		client.authStore.loadFromCookie(event.cookies.get("pbUser") as string);
		if (!client.authStore.isValid) {
			return {
				user: null,
				habits: [],
				error: "User not found"
			};
		}

		// Fetch habits from the database
		const habits = await client.collection("habits").getList<HabitType>();

		// Return the user and habits
		return {
			user,
			habits: habits.items
		};
	} catch (error) {
		console.error("Failed to load habits:", error);
		return {
			user: event.locals.user,
			habits: [],
			error: "Failed to load habits"
		};
	}
};

export const actions = {
	addHabit: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			const data = await event.request.formData();
			const name = data.get('name')?.toString().trim();

			// Validate input fields
			if (!name) {
				return ERROR_RESPONSE("Name is required.");
			}

			// Attempt to create the habit
			const habitData = await client.collection("habits").create<HabitType>({
				author: event.locals.user?.id,
				name: name,
				completed: []
			});

			// Handle successful creation
			if (habitData) {
				return SUCCESS_RESPONSE("Habit created successfully.", habitData);
			} else {
				return ERROR_RESPONSE("Failed to create the habit.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error creating habit:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Habit creation failed: ${message}`);
		}
	},
	deleteHabit: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			// Extract the habit ID from the request
			const data = await event.request.formData();
			const habitId = data.get('habitId')?.toString().trim();

			// Validate the habit ID
			if (!habitId) {
				return ERROR_RESPONSE("Habit ID is required.");
			}

			// Attempt to delete the habit from the database
			const deletionResult = await client.collection("habits").delete(habitId);

			// Check if deletion was successful
			if (deletionResult) {
				return SUCCESS_RESPONSE("Habit deleted successfully.");
			} else {
				return ERROR_RESPONSE("Failed to delete the habit.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error deleting habit:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Habit deletion failed: ${message}`);
		}
	},
	updateHabit: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			// Extract the habit ID and completion date from the request
			const data = await event.request.formData();
			const habitId = data.get('habitId')?.toString().trim();
			const completionDate = data.get('completionDate')?.toString().trim();
			const name = data.get('name')?.toString().trim();

			// Validate the habit ID and completion date
			if (!habitId || !name) {
				return ERROR_RESPONSE("Habit ID and completion date are required.");
			}

			// Fetch the habit to update
			const habit = await client.collection("habits").getOne<HabitType>(habitId);
			if (!habit) {
				return ERROR_RESPONSE("Habit not found.");
			}

			let updatedCompleted: string[] = habit.completed;

			// Update the habit's completed dates
			if (completionDate) {
				// Toggle the completion date
				if (updatedCompleted.includes(completionDate)) {
					updatedCompleted = updatedCompleted.filter(date => date !== completionDate);
				} else {
					updatedCompleted = [...updatedCompleted, completionDate];
				}
			}

			// Attempt to update the habit in the database
			const updateResult = await client.collection("habits").update<HabitType>(habitId, {
				completed: updatedCompleted,
				name: name
			});

			// Check if update was successful
			if (updateResult) {
				return SUCCESS_RESPONSE("Habit updated successfully.", updateResult);
			} else {
				return ERROR_RESPONSE("Failed to update the habit.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error updating habit:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Habit update failed: ${message}`);
		}
	}
};
