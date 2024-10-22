import OpenAI from 'openai';
import { OPENAI_KEY, OPENAI_ORG } from '$env/static/private';

// Initialize OpenAI API configuration
const openai = new OpenAI({
	apiKey: OPENAI_KEY,
	organization: OPENAI_ORG
});

// Function to summarize text
export async function getAISummary(text: string): Promise<string> {
	try {
		// Call OpenAI's API with the text and a prompt to summarize
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a helpful assistant that summarizes text. Whatever the user asks you to summarize, you should provide a brief and concise summary of the text. Even if the text is long, you should be able to provide a summary that captures the main points. Even if the text is short you must provide a summary. You should always provide a summary of the text. The texts that you will summarize are ressources from a notebook in the app."
				},
				{
					role: "user",
					content: `Summarize these ressources: ${text}`,
				},
			],
		});

		// Extract and return the summarized text from the response
		// const summary = response.data.choices[0]?.message?.content;
		const summary = response.choices[0].message.content;
		return summary ? summary.trim() : "No summary available.";
	} catch (error: any) {
		console.error("Error summarizing text:", error?.response?.data || error.message);
		throw new Error("Failed to summarize text.");
	}
}
