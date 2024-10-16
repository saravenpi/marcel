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
				events: [],
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

		// Fetch events from the database
		const events = await client.collection("events").getList();

		// Sort the events by date
		events.items.sort((a, b) => {
			return new Date(a.date).getTime() - new Date(b.date).getTime();
		});

		// Return the user and events
		return {
			user,
			events: events.items // Assuming the events list is in the "items" property
		};
	} catch (error) {
		console.error("Failed to load events:", error);
		// Optionally, you can handle the error gracefully by returning an empty list or an error message
		return {
			user: event.locals.user,
			events: [],
			error: "Failed to load events"
		};
	}
};

export const actions = {
	addEvent: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			const data = await event.request.formData();
			const title = data.get('title')?.toString().trim();
			const description = data.get('description')?.toString().trim();
			const date = data.get('date')?.toString().trim();
			const address = data.get('address')?.toString().trim();

			// Validate input fields
			if (!title || !description || !date) {
				return ERROR_RESPONSE("Title, description and date are required.");
			}

			// Attempt to create the event
			const eventData = await client.collection("events").create({
				author: event.locals.user?.id,
				title,
				description,
				date,
				address: address ? address : undefined
			});

			// Handle successful creation
			if (eventData) {
				return SUCCESS_RESPONSE("Event created successfully.", eventData);
			} else {
				return ERROR_RESPONSE("Failed to create the event.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error creating event:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Event creation failed: ${message}`);
		}
	},
	deleteEvent: async (event: RequestEvent): Promise<ServerResponse> => {
		try {
			// Extract the event ID from the request
			const data = await event.request.formData();
			const eventId = data.get('eventId')?.toString().trim();

			// Validate the event ID
			if (!eventId) {
				return ERROR_RESPONSE("Event ID is required.");
			}

			// Attempt to delete the event from the database
			const deletionResult = await client.collection("events").delete(eventId);

			// Check if deletion was successful
			if (deletionResult) {
				return SUCCESS_RESPONSE("Event deleted successfully.");
			} else {
				return ERROR_RESPONSE("Failed to delete the event.");
			}
		} catch (error: unknown) {
			// Log the error for debugging purposes
			console.error("Error deleting event:", error);

			// Return a detailed error message if possible
			const message = error instanceof Error ? error.message : "An unexpected error occurred.";
			return ERROR_RESPONSE(`Event deletion failed: ${message}`);
		}
	}
};
