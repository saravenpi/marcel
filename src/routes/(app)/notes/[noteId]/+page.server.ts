import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';
import { type NoteType, type User } from '$lib/types'; // Adjust these imports to match your type definitions
import { PB_URL } from '$env/static/private';
import type { Actions } from './$types';
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from '$lib/response';

// Initialize PocketBase client
const client = new PocketBase(PB_URL); // Replace with your PocketBase URL

// Load function to fetch the notebook by ID
export const load: PageServerLoad = async (event) => {
	// Fetch the user from the locals
	const user: User | null = event.locals.user;

	// Ensure the user exists
	if (!user) {
		return {
			user: null,
			note: null,
			error: "User not found"
		};
	}

	client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);
	if (!client.authStore.isValid) {
		return {
			user: null,
			note: null,
			error: 'User not found'
		};
	}

	// Get the note from the route parameters
	const noteId = event.params.noteId;

	try {
		// Fetch the note by its ID
		const note: NoteType = await client.collection('notes').getOne(noteId);

		// Ensure the note belongs to the current user
		if (note.author !== user.id) {
			return {
				user,
				note: null,
				error: "You don't have access to this note"
			};
		}

		// Return the note data
		return {
			user,
			note
		};
	} catch (error) {
		console.error('Error fetching note:', error);
		return {
			user,
			note: null,
			error: 'Failed to fetch note.'
		};
	}
};

export const actions: Actions = {
	updateNote: async ({ request }) => {
		const formData = await request.formData();
		const noteId = formData.get('id')?.toString(); // Assuming the note's ID is sent in the form
		const title = formData.get('title')?.toString()
		const content = formData.get('content')?.toString()

		if (!noteId || !title || !content) {
			return ERROR_RESPONSE('Note ID, title, and content are required');
		}

		try {
			// Update the note in PocketBase
			await client.collection('notes').update(noteId, {
				title,
				content,
			});

			// Optionally redirect to another page or stay on the same page
			return SUCCESS_RESPONSE('Note updated successfully');
		} catch (error) {
			console.error('Error updating note:', error);
			return ERROR_RESPONSE('Failed to update note');
		}
	},
	deleteNote: async (event) => {
		const formData = await event.request.formData();
		const noteId = formData.get('id')?.toString(); // Assuming the note's ID is sent in the form

		if (!noteId) {
			return ERROR_RESPONSE('Note ID is required');
		}

		client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);
		if (!client.authStore.isValid) {
			return {
				user: null,
				note: null,
				error: 'User not found'
			};
		}
		try {
			// Delete the note from PocketBase
			const deleteResult = await client.collection('notes').delete(noteId);

			if (!deleteResult) {
				return ERROR_RESPONSE('Failed to delete note');
			}
			return SUCCESS_RESPONSE('Note deleted successfully');
		} catch (error) {
			console.error('Error deleting note:', error);
			return ERROR_RESPONSE('Failed to delete note');
		}
	}
};
