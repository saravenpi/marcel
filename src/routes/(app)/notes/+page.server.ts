import { PB_URL } from '$env/static/private';
import PocketBase from 'pocketbase';
import type { User } from '$lib/types';
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from '$lib/response';
import type { PageServerLoad, RequestEvent } from './$types';

// Initialize PocketBase client
const client = new PocketBase(PB_URL);

export const load: PageServerLoad = async (event: RequestEvent) => {
	try {
		// Fetch the user from the locals
		const user: User | null = event.locals.user;

		// Ensure the user exists
		if (!user) {
			return {
				user: null,
				notes: [],
				error: "User not found"
			}
		}

		client.authStore.loadFromCookie(event.cookies.get("pbUser") as string)
		if (!client.authStore.isValid)
			return {
				user: null,
				notes: [],
				error: "User not found"
			}


		// Fetch notes from the database
		const notes = await client.collection("notes").getList();

		// Return the user and notesj
		return {
			user,
			notes: notes.items // Assuming the notes list is in the "items" property
		};
	} catch (error) {
		console.error("Failed to load notes:", error);
		// Optionally, you can handle the error gracefully by returning an empty list or an error message
		return {
			user: event.locals.user,
			notes: [],
			error: "Failed to load notes"
		};
	}
}
// Handle the POST request to create a new note from FormData
const addNote = async (event: any) => {
	try {
		// Get the incoming form data
		const formData = await event.request.formData();
		const user: User | null = event.locals.user;

		// Extract fields from the form data
		const title = formData.get('title')?.toString();
		const content = formData.get('content')?.toString();
		const notebookId = formData.get('notebookId')?.toString();


		if (!title || !content) {
			return ERROR_RESPONSE('Title and content are required');
		}

		if (!user) {
			return ERROR_RESPONSE('User not found');
		}

		client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);

		if (!client.authStore.isValid) {
			return ERROR_RESPONSE('User not found');
		}

		// Send the data to PocketBase
		const createdNote = await client.collection('notes').create({
			title,
			content,
			author: user.id,
			ressources: [],
			notebook: notebookId,
		});

		console.log(createdNote)

		if (!createdNote) {
			throw new Error('Failed to create note');
		}

		return SUCCESS_RESPONSE('Note created successfully', createdNote);

	} catch (error) {
		console.error('Error creating note:', error);
		return ERROR_RESPONSE('Failed to create note');

	}
};

export const actions = {
	addNote,
};
