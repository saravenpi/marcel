import { YoutubeTranscript } from 'youtube-transcript';

// Helper function to extract the video ID from various YouTube URL formats
const extractVideoId = (url: string): string | null => {
	try {
		const parsedUrl = new URL(url);
		const hostname = parsedUrl.hostname;

		// Handle standard YouTube URLs with 'v' parameter
		if (hostname.includes('youtube.com')) {
			return parsedUrl.searchParams.get('v');
		}

		// Handle shortened YouTube URLs (youtu.be)
		if (hostname === 'youtu.be') {
			return parsedUrl.pathname.substring(1); // Extract after '/'
		}

		// Handle embed URLs (youtube.com/embed/VIDEO_ID)
		if (hostname.includes('youtube.com') && parsedUrl.pathname.startsWith('/embed/')) {
			return parsedUrl.pathname.split('/embed/')[1];
		}

		// Invalid URL format
		return null;
	} catch (error) {
		console.error('Error parsing URL:', error);
		return null;
	}
};

// Function to get the YouTube transcript
export const getYoutubeTranscript = async (url: string): Promise<string> => {
	try {
		// Extract the video ID from the provided URL
		const videoId = extractVideoId(url);
		if (!videoId) {
			console.log('Invalid YouTube URL: ', url);
			return ''; // Invalid URL or unable to extract video ID
		}

		// Fetch the transcript using the extracted video ID
		const transcript = await YoutubeTranscript.fetchTranscript(videoId);

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
