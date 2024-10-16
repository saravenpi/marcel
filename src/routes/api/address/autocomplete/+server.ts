import { json } from '@sveltejs/kit';
import { PACKAGEX_API_KEY } from '$env/static/private'
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request }) => {
	const { address } = await request.json();

	try {
		const response = await fetch('https://api.packagex.io/v1/address/autocomplete', {
			method: 'POST',
			headers: {
				'PX-API-KEY': PACKAGEX_API_KEY,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ address }),
		});
		const data = await response.json();

		return json(data);
	} catch (error) {
		return json({ error: 'Error fetching data' }, { status: 500 });
	}
};
