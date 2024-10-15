import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "$lib/response";
import { PB_URL } from '$env/static/private'
import PocketBase from "pocketbase";
import type { PageServerLoad, RequestEvent } from "./$types";
import type { ServerResponse, User } from "$lib/types";

let client = new PocketBase(PB_URL)

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		// Fetch the user from the locals
		const user: User | null = event.locals.user;

		// Ensure the user exists
		if (!user) {
			return {
				user: null,
				todos: [],
				error: "User not found"
			}
		}

		client.authStore.loadFromCookie(event.cookies.get("pbUser") as string)
		if (!client.authStore.isValid)
			return {
				user: null,
				events: [],
				error: "User not found"
			}


		// Fetch todos from the database
		const todos = await client.collection("todos").getList();

		// Return the user and todos
		return {
			user,
			todos: todos.items // Assuming the todos list is in the "items" property
		};
	} catch (error) {
		console.error("Failed to load todos:", error);
		// Optionally, you can handle the error gracefully by returning an empty list or an error message
		return {
			user: event.locals.user,
			todos: [],
			error: "Failed to load todos"
		};
	}
};

export const actions = {
	addTodo: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			const data = await event.request.formData();
			const title = data.get('title')?.toString().trim();

			// Validate input fields
			if (!title) {
				return ERROR_RESPONSE("Title is required.");
			}

			// Attempt to create the todo
			const todoData = await client.collection("todos").create({
				author: event.locals.user?.id,
				title,
				done: false
			});

			// Handle successful creation
			if (todoData) {
				return SUCCESS_RESPONSE("Todo created successfully.", todoData);
			} else {
				return ERROR_RESPONSE("Failed to create the todo.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error creating todo:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Todo creation failed: ${message}`);
		}
	},
	deleteTodo: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			// Extract the todo ID from the request
			const data = await event.request.formData();
			const todoId = data.get('todoId')?.toString().trim();

			// Validate the todo ID
			if (!todoId) {
				return ERROR_RESPONSE("Todo ID is required.");
			}

			// Attempt to delete the todo from the database
			const deletionResult = await client.collection("todos").delete(todoId);

			// Check if deletion was successful
			if (deletionResult) {
				return SUCCESS_RESPONSE("Todo deleted successfully.");
			} else {
				return ERROR_RESPONSE("Failed to delete the todo.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error deleting todo:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Todo deletion failed: ${message}`);
		}
	},
	updateTodo: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			// Extract the todo ID and status from the request
			const data = await event.request.formData();
			const todoId = data.get('todoId')?.toString().trim();
			const done = data.get('done')?.toString().trim() === "true";
			// Validate the todo ID
			if (!todoId) {
				return ERROR_RESPONSE("Todo ID is required.");
			}
			// Attempt to update the todo in the database
			const updateResult = await client.collection("todos").update(todoId, {
				done
			});
			// Check if update was successful
			if (updateResult) {
				return SUCCESS_RESPONSE("Todo updated successfully.", updateResult)
			} else {
				return ERROR_RESPONSE("Failed to update the todo.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error updating todo:", error);
			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Todo update failed: ${message}`);
		}
	}
};
