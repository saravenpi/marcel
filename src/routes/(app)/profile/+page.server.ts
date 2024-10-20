import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';
import { type User } from '$lib/types'; // Adjust these imports to match your type definitions
import { PB_URL } from '$env/static/private';

// Initialize PocketBase client
const client = new PocketBase(PB_URL); // Replace with your PocketBase URL

// Load function to fetch the notebook by ID and its notes
export const load: PageServerLoad = async (event) => {
	// Fetch the user from the locals
	const user: User | null = event.locals.user;

	// Ensure the user exists
	if (!user) {
		return {
			user: null,
			error: "User not found"
		};
	}

	client.authStore.loadFromCookie(event.cookies.get('pbUser') as string);
	if (!client.authStore.isValid) {
		return {
			user: null,
			error: 'User not found'
		};
	}

	return {
		user,
	};
}
