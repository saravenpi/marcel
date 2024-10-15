import { authUser } from '$lib/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PB_URL } from '$env/static/private';
import PocketBase from 'pocketbase';

let client = new PocketBase(PB_URL);

const NON_AUTH_PAGES = [
	"/",
	"/login",
	"/register"
]
export const authentication: Handle = async ({ event, resolve }) => {
	// auth
	event.locals.user = authUser(event);

	// route safety
	if (!event.locals.user && (NON_AUTH_PAGES.includes(event.url.pathname))) {
		const response = await resolve(event);
		return response;
	}

	if (!event.locals.user && event.url.pathname != '/') {
		event.cookies.delete("auth", { path: "/" });
		event.cookies.delete("pbUser", { path: "/" });
		client.authStore.clear();
		throw redirect(303, '/');
	}
	if (event.locals.user && (NON_AUTH_PAGES.includes(event.url.pathname)))
		throw redirect(303, '/events');

	// hooks sequence
	const response = await resolve(event);
	return response;
}

export const handle = sequence(authentication)
