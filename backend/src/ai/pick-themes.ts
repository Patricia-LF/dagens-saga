import type { StoryTheme } from "./themes.js";

// Picks `count` random themes that are not in `usedThemes` (compared exactly as written).
// Throws if there are fewer unused themes than `count`, so the caller can stop before any API call.
export function pickThemes(
  allThemes: StoryTheme[],
  usedThemes: string[],
  count: number,
): StoryTheme[] {
  const used = new Set(usedThemes);
  const unused = allThemes.filter(({ theme }) => !used.has(theme));

  if (unused.length < count) {
    throw new Error(
      `Only ${unused.length} unused themes left. Add more to src/ai/themes.ts.`,
    );
  }

  // Fisher-Yates shuffle of the unused list, then take the first `count`,
  // so no theme is picked twice.
  for (let i = unused.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // i and j are always valid indexes, so the "!" (not undefined) is safe here.
    [unused[i], unused[j]] = [unused[j]!, unused[i]!];
  }
  return unused.slice(0, count);
}
