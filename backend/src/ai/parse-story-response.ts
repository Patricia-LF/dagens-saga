export interface ParsedStory {
  title: string;
  body: string;
  characters: string[];
}

const CHARACTERS_PREFIX = /^\**\s*figurer\s*:\s*\**/i;

// The model sometimes adds formatting around the title even though we ask it not to.
function cleanTitle(line: string): string {
  return line
    .trim()
    .replace(/^\**\s*titel\s*:\s*\**/i, "")
    .replace(/^[*"'“”«»]+|[*"'“”«»]+$/g, "")
    .trim();
}

function parseCharacters(line: string): string[] {
  return line
    .replace(CHARACTERS_PREFIX, "")
    .replace(/\**\s*\.?\s*$/, "")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

// Turns the AI answer (title, blank line, story, blank line, "Figurer: ...") into story fields.
export function parseStoryResponse(text: string): ParsedStory {
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  const titleIndex = lines.findIndex((line) => line.trim() !== "");
  if (titleIndex === -1) {
    throw new Error("AI response has no title");
  }
  const title = cleanTitle(lines[titleIndex] ?? "");
  if (title === "") {
    throw new Error("AI response has no title");
  }

  const afterTitle = lines.slice(titleIndex + 1);
  const charactersIndex = afterTitle.findLastIndex((line) =>
    CHARACTERS_PREFIX.test(line.trim()),
  );
  const bodyLines =
    charactersIndex === -1 ? afterTitle : afterTitle.slice(0, charactersIndex);
  const characters =
    charactersIndex === -1 ? [] : parseCharacters((afterTitle[charactersIndex] ?? "").trim());

  // Paragraphs are separated by one or more blank lines. Single line breaks (dialogue) are kept.
  const body = bodyLines
    .join("\n")
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .join("\n"),
    )
    .filter((paragraph) => paragraph !== "")
    .join("\n\n");

  if (body === "") {
    throw new Error("AI response has no story body");
  }

  return { title, body, characters };
}
