import PocketBase from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';
import { type NotebookType, type User } from '$lib/types'; // Import the types you defined
import { PB_URL } from '$env/static/private';
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from '$lib/response';

// Initialize PocketBase client
const client = new PocketBase(PB_URL); // Change to your PocketBase URL

// Load function to fetch the user's notebooks
export const load: PageServerLoad = async (event) => {
	// Fetch the user from the locals
	const user: User | null = event.locals.user;

	client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);
	if (!client.authStore.isValid) {
		return {
			user: null,
			notebooks: [],
			error: 'User not found'
		};
	}
	// Ensure the user exists
	if (!user) {
		return {
			user: null,
			notebooks: [],
			error: "User not found"
		};
	}

	try {
		// Fetch all notebooks for the current user
		const notebooks = await client.collection('notebooks').getList()

		if (!notebooks.items) {
			return {
				user,
				notebooks: [],
				error: 'Failed to fetch notebooks.'
			};
		}

		return {
			user,
			notebooks: notebooks.items
		};
	} catch (error) {
		console.error('Error fetching notebooks:', error);
		return {
			user,
			notebooks: [],
			error: 'Failed to fetch notebooks.'
		};
	}
};

export const actions: Actions = {
	// Action to create a new notebook
	createNotebook: async (event: any) => {
		const formData = await event.request.formData();

		const name = formData.get('name') as string | null;
		const description = formData.get('description') as string | null;


		console.log(formData)
		if (!name || !description) {
			// Return an error if any required field is missing
			return ERROR_RESPONSE('Missing required fields: name or description.');
		}

		// Fetch the user from the locals
		const user: User | null = event.locals.user;

		// Ensure the user exists
		if (!user) {
			return ERROR_RESPONSE('User not found')
		}

		let author = user.id
		const notebookData = { author, name, description };

		// Create the notebook record in PocketBase
		try {
			const notebookRecord: NotebookType = await client.collection('notebooks').create(notebookData);
			return SUCCESS_RESPONSE('Notebook created successfully', notebookRecord);
		} catch (error) {
			console.error('Error creating notebook:', error);
			return ERROR_RESPONSE('Failed to create notebook');
		}
	},


};
