const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Story = {
  id: number;
  title: string;
  body: string;
  scheduledDate: string; // "YYYY-MM-DD"
  source: "ai" | "handwritten";
  imageUrl: string | null;
};

// The archive list only gets the fields it shows, not the whole story
export type StorySummary = Pick<
  Story,
  "id" | "title" | "scheduledDate" | "source"
>;

// Fetches JSON from the backend. Returns null on 404, throws on other errors.
async function getJson<T>(path: string): Promise<T | null> {
  if (!API_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Add it to mobile/.env.");
  }

  const response = await fetch(`${API_URL}${path}`);

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Request to ${path} failed (status ${response.status})`);
  }

  return (await response.json()) as T;
}

// Returns today's story from the backend, or null if there is none
export async function getTodaysStory(): Promise<Story | null> {
  return getJson<Story>("/stories/today");
}

// Returns all visible stories, newest first
export async function getArchive(): Promise<StorySummary[]> {
  return (await getJson<StorySummary[]>("/stories")) ?? [];
}

// Returns one story, or null if it doesn't exist or isn't visible yet
export async function getStory(id: number): Promise<Story | null> {
  // An invalid id in the URL (for example /story/abc) means "not found" for the reader
  if (!Number.isInteger(id) || id <= 0) return null;
  return getJson<Story>(`/stories/${id}`);
}
