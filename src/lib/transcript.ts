import { YoutubeTranscript } from 'youtube-transcript';

// Function to get the YouTube transcript
export const getYoutubeTranscript = async (url: string): Promise<string> => {
	try {

		const transcript = await YoutubeTranscript.fetchTranscript(url);

		// Convert the transcript array into a single string
		const transcriptText = transcript
			.map((item) => item.text)
			.join(' ');

		return transcriptText;
	} catch (error: any) {
		console.error('Error fetching YouTube transcript:', error.message);
		return ''; // Return empty string on failure
	}
};

export const getPDFTranscript = async (file: string): Promise<string> => {
	return ""
}
