import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';
import { RessourceTypeEnum, type NotebookType, type NoteType, type RessourceType, type User } from '$lib/types'; // Adjust these imports to match your type definitions
import { PB_URL } from '$env/static/private';
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from '$lib/response';

// Initialize PocketBase client
const client = new PocketBase(PB_URL); // Replace with your PocketBase URL

// Load function to fetch the notebook by ID, its notes, and ressources
export const load: PageServerLoad = async (event) => {
	// Fetch the user from the locals
	const user: User | null = event.locals.user;

	// Ensure the user exists
	if (!user) {
		return {
			user: null,
			notebook: null,
			notes: [],
			ressources: [],
			error: "User not found"
		};
	}

	client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);
	if (!client.authStore.isValid) {
		return {
			user: null,
			notebook: null,
			notes: [],
			ressources: [],
			error: 'User not found'
		};
	}

	// Get the notebookId from the route parameters
	const notebookId = event.params.notebookId;

	try {
		// Fetch the notebook by its ID
		const notebook: NotebookType = await client.collection('notebooks').getOne(notebookId);

		// Ensure the notebook belongs to the current user
		if (notebook.author !== user.id) {
			return {
				user,
				notebook: null,
				notes: [],
				ressources: [],
				error: "You don't have access to this notebook"
			};
		}

		// Fetch all notes related to this notebook
		const notes: NoteType[] = await client.collection('notes').getFullList<NoteType>({
			filter: `notebook = "${notebookId}"`, // Filter by notebook ID
		});

		// Fetch all ressources related to this notebook
		const ressources: RessourceType[] = await client.collection('ressources').getFullList<RessourceType>({
			filter: `notebook = "${notebookId}"`, // Filter by notebook ID
		});

		// Return the notebook, its notes, and ressources
		return {
			user,
			notebook,
			notes,
			ressources,
		};
	} catch (error) {
		console.error('Error fetching notebook, notes, or ressources:', error);
		return {
			user,
			notebook: null,
			notes: [],
			ressources: [],
			error: 'Failed to fetch notebook, notes, or ressources.'
		};
	}
};// Handle the POST request to create a new note from FormData
const addNote = async (event: any) => {
	try {
		// Get the incoming form data
		const formData = await event.request.formData();
		const user: User | null = event.locals.user;

		// Extract fields from the form data
		const title = formData.get('title')?.toString();
		const content = formData.get('content')?.toString();
		const notebookId = formData.get('notebookId')?.toString();

		// Validate form data
		if (!title || !content) {
			return ERROR_RESPONSE('Title and content are required');
		}

		if (!user) {
			return ERROR_RESPONSE('User not found');
		}

		// Load user authentication from cookies
		client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);

		if (!client.authStore.isValid) {
			return ERROR_RESPONSE('User not found');
		}

		// Send the data to PocketBase to create the note
		const createdNote = await client.collection('notes').create({
			title,
			content,
			author: user.id,
			ressources: [],
			notebook: notebookId,
		});

		if (!createdNote) {
			throw new Error('Failed to create note');
		}

		// Fetch the corresponding notebook by its ID
		const notebook = await client.collection('notebooks').getOne(notebookId);

		if (!notebook) {
			return ERROR_RESPONSE('Notebook not found');
		}

		// Update the notebook by adding the newly created note's ID to the 'notes' field
		const updatedNotes = notebook.notes ? [...notebook.notes, createdNote.id] : [createdNote.id];

		// Update the notebook record with the new list of notes
		const updatedNotebook = await client.collection('notebooks').update(notebookId, {
			notes: updatedNotes
		});

		if (!updatedNotebook) {
			throw new Error('Failed to update notebook with new note');
		}

		return SUCCESS_RESPONSE('Note created and added to notebook successfully', createdNote);

	} catch (error) {
		console.error('Error creating note or updating notebook:', error);
		return ERROR_RESPONSE('Failed to create note and update notebook');
	}
};

const createRessource = async (event: any) => {
	const formData = await event.request.formData();

	// Validate the form data
	const ressourceName = formData.get('name') as string | null;
	const content = formData.get('content') as string | null;
	const type = formData.get('type') as string | null;
	const notebookId = formData.get('notebookId') as string | null;

	if (!ressourceName || !content || !type || !notebookId) {
		// Return an error if any required field is missing
		return ERROR_RESPONSE('Missing required fields: name, content, type or notebookId.');
	}

	// Validate the ressource type
	if (!Object.values(RessourceTypeEnum).includes(type as RessourceTypeEnum)) {
		return ERROR_RESPONSE('Invalid ressource type');
	}

	// Fetch the user from the locals
	const user: User | null = event.locals.user;

	// Ensure the user exists
	if (!user) {
		return ERROR_RESPONSE('User not found')
	}

	const ressourceData = {
		author: user.id,
		name: ressourceName,
		content: content,
		type: type as RessourceTypeEnum,
		notebook: notebookId
	};

	// Create the ressource record and associate it with the notebook
	try {
		const ressourceRecord = await client.collection('ressources').create(ressourceData);

		// Optionally update the notebook with the new ressource
		const notebookRecord = await client.collection('notebooks').getOne(notebookId);
		await client.collection('notebooks').update(notebookId, {
			ressources: [...notebookRecord.ressources, ressourceRecord.id]
		});

		return SUCCESS_RESPONSE('Ressource created successfully', ressourceRecord);
	} catch (error) {
		console.error('Error creating ressource:', error);
		return ERROR_RESPONSE('Failed to create ressource');
	}
}

const deleteRessource = async (event: any) => {
	const formData = await event.request.formData();

	// Get the ressource ID and notebook ID from the request form data
	const ressourceId = formData.get('ressourceId') as string | null;
	const notebookId = formData.get('notebookId') as string | null;

	// Validate required fields
	if (!ressourceId || !notebookId) {
		return ERROR_RESPONSE('Missing required fields: ressourceId or notebookId.');
	}

	// Fetch the user from the locals
	const user: User | null = event.locals.user;

	// Ensure the user exists
	if (!user) {
		return ERROR_RESPONSE('User not found');
	}

	// Fetch the ressource to ensure it exists and belongs to the user
	let ressourceRecord;
	try {
		ressourceRecord = await client.collection('ressources').getOne(ressourceId);

		// Check if the user is the author of the resource
		if (ressourceRecord.author !== user.id) {
			return ERROR_RESPONSE('Unauthorized: You do not have permission to delete this ressource.');
		}
	} catch (error) {
		console.error('Error fetching ressource:', error);
		return ERROR_RESPONSE('Ressource not found');
	}

	// Delete the ressource record
	try {
		await client.collection('ressources').delete(ressourceId);

		// Optionally update the notebook to remove the deleted ressource
		const notebookRecord = await client.collection('notebooks').getOne(notebookId);
		const updatedRessources = notebookRecord.ressources.filter((id: string) => id !== ressourceId);

		await client.collection('notebooks').update(notebookId, {
			ressources: updatedRessources
		});

		return SUCCESS_RESPONSE('Ressource deleted successfully');
	} catch (error) {
		console.error('Error deleting ressource:', error);
		return ERROR_RESPONSE('Failed to delete ressource');
	}
};

export const actions = {
	addNote,
	createRessource,
	deleteRessource
};
