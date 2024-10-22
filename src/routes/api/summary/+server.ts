import { getAISummary } from "$lib/ai";
import { getPDFTranscript, getYoutubeTranscript } from "$lib/transcript";
import { RessourceTypeEnum, type RessourceType } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";

async function getRessourcesAISummary(ressources: RessourceType[]): Promise<string> {
	const transcripts: string[] = []

	for (let i = 0; i < ressources.length; i++) {
		const ressource: RessourceType = ressources[i];

		if (ressource.type === RessourceTypeEnum.TEXT) {
			transcripts.push(ressource.content);
		}
		if (ressource.type === RessourceTypeEnum.VIDEO) {
			const transcript = await getYoutubeTranscript(ressource.content);
			transcripts.push(transcript);
		}
		if (ressource.type === RessourceTypeEnum.PDF) {
			const transcript = await getPDFTranscript(ressource.content);
			transcripts.push(transcript);
		}
	}

	let text: string = transcripts.join("\n");
	let aiSummary: string = await getAISummary(text);

	return aiSummary;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse the incoming request data
		const body = await request.json();
		const ressources: RessourceType[] = body.ressources;

		// Call your AI summary service (like OpenAI or custom logic) here
		const summary = await getRessourcesAISummary(ressources);

		// Return the AI summary
		return json({ summary });
	} catch (error) {
		console.error('Error generating summary:', error);
		return json({ error: 'Failed to generate summary' }, { status: 500 });
	}
};


