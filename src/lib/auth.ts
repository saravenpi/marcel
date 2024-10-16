import { type Cookies, type RequestEvent } from "@sveltejs/kit";
import type { ServerResponse, User } from "$lib/types";
import { ERROR_RESPONSE, SUCCESS_RESPONSE } from "$lib/response";
import { PB_URL } from "$env/static/private";
import PocketBase from "pocketbase";

let client = new PocketBase(PB_URL);

export const storeUserAuthCookie = (event: RequestEvent, user: User) => {
	const serializedObject = JSON.stringify(user);
	event.cookies.set('auth', serializedObject, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7, // 1 week
	});

	return event.cookies
}

export const authUser = async (event: RequestEvent): Promise<User | null> => {
	try {
		const authCookie: string | undefined = event.cookies.get('auth');
		const pbUserCookie: string | undefined = event.cookies.get('pbUser');

		if (authCookie && pbUserCookie) {
			client.authStore.loadFromCookie(pbUserCookie);
			if (!client.authStore.isValid)
				return null;
			const user: User = JSON.parse(authCookie);
			return user;
		} else {
			return null;
		}
	} catch (_) {
		return null;
	}
}

export const logout = (eventOrCookies: RequestEvent | Cookies): ServerResponse => {
	try {
		const cookies = 'cookies' in eventOrCookies ? eventOrCookies.cookies : eventOrCookies;
		cookies.delete('auth', { path: '/' });
		cookies.delete('pbUser', { path: '/' });
		return SUCCESS_RESPONSE("Logged out successfully");
	} catch (error) {
		console.error('Logout error:', error);
		return ERROR_RESPONSE("Failed to log out");
	}
}
