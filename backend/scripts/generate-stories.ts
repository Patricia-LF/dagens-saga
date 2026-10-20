// Must be the first import. ES modules run their imports in the order they are written,
// so .env is loaded before src/db.ts reads DATABASE_URL.
import "dotenv/config";
import { parseArgs } from "node:util";
import OpenAI from "openai";
import { prisma } from "../src/db.js";
import { buildStoryPrompt } from "../src/ai/story-prompt.js";
import { parseStoryResponse } from "../src/ai/parse-story-response.js";
import {
  STORY_MODEL,
  countWords,
  estimateCost,
  generateStoryText,
} from "../src/ai/openai-story.js";
import { THEMES, type StoryTheme } from "../src/ai/themes.js";
import { addDays, firstFreeDate, formatDate } from "../src/stockholm-date.js";

// Local script: generates a batch of stories and saves them as drafts with planned dates.
// Nothing is published. Review, edit and publish the drafts yourself.
// Run: npm run generate -- --count 7 [--age 6] [--min-words 250] [--max-words 350]

const RECENT_STORIES_FOR_CHARACTERS = 20;

interface Options {
  count: number;
  age: number;
  minWords: number;
  maxWords: number;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function parsePositiveInt(name: string, value: string | undefined, fallback?: number): number {
  if (value === undefined) {
    if (fallback === undefined) {
      fail(`--${name} is required.`);
    }
    return fallback;
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    fail(`--${name} must be a positive whole number, got "${value}".`);
  }
  return number;
}

function readFlags() {
  try {
    return parseArgs({
      options: {
        count: { type: "string" },
        age: { type: "string" },
        "min-words": { type: "string" },
        "max-words": { type: "string" },
      },
    }).values;
  } catch (error) {
    // parseArgs throws on unknown flags, for example a typo like --cuont.
    fail(errorMessage(error));
  }
}

function readOptions(): Options {
  const values = readFlags();

  const options: Options = {
    count: parsePositiveInt("count", values.count),
    age: parsePositiveInt("age", values.age, 6),
    minWords: parsePositiveInt("min-words", values["min-words"], 250),
    maxWords: parsePositiveInt("max-words", values["max-words"], 350),
  };

  if (options.minWords > options.maxWords) {
    fail("--min-words cannot be larger than --max-words.");
  }
  if (options.count > THEMES.length) {
    fail(
      `--count is ${options.count}, but there are only ${THEMES.length} themes in src/ai/themes.ts. ` +
        "A batch never repeats a theme.",
    );
  }
  return options;
}

// Shuffles a copy of the list (Fisher-Yates) and takes the first `count` entries,
// so no theme is used twice in one batch.
function pickThemes(count: number): StoryTheme[] {
  const shuffled = [...THEMES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // i and j are always valid indexes, so the "!" (not undefined) is safe here.
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.slice(0, count);
}

async function loadRecentCharacters(): Promise<string[]> {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    take: RECENT_STORIES_FOR_CHARACTERS,
    select: { characters: true },
  });
  return [...new Set(stories.flatMap((story) => story.characters))];
}

async function loadLatestScheduledDate(): Promise<Date | null> {
  const latest = await prisma.story.findFirst({
    where: { scheduledDate: { not: null } },
    orderBy: { scheduledDate: "desc" },
    select: { scheduledDate: true },
  });
  return latest?.scheduledDate ?? null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
  // Validate the flags first, so mistakes stop the script before any API call or database query.
  const options = readOptions();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    fail("OPENAI_API_KEY is missing. Add it to backend/.env.");
  }
  const client = new OpenAI({ apiKey });

  const themes = pickThemes(options.count);
  const avoidCharacters = await loadRecentCharacters();
  let nextDate = firstFreeDate(await loadLatestScheduledDate());

  const saved: { date: string; title: string }[] = [];
  let failed = 0;
  let inputTokens = 0;
  let outputTokens = 0;

  for (const [index, { theme, lesson }] of themes.entries()) {
    console.log(`\n[${index + 1}/${themes.length}] Theme: ${theme}`);

    const prompt = buildStoryPrompt({
      theme,
      lesson,
      age: options.age,
      minWords: options.minWords,
      maxWords: options.maxWords,
      avoidCharacters,
    });

    try {
      const result = await generateStoryText(client, STORY_MODEL, prompt);
      inputTokens += result.inputTokens;
      outputTokens += result.outputTokens;

      if (result.status !== "completed") {
        throw new Error(
          `Response status is "${result.status}"${result.incompleteReason ? ` (${result.incompleteReason})` : ""}, so the story may be cut off.`,
        );
      }

      const story = parseStoryResponse(result.text);

      const wordCount = countWords(story.body);
      if (wordCount < options.minWords || wordCount > options.maxWords) {
        console.log(
          `WARNING: ${wordCount} words, outside ${options.minWords}-${options.maxWords}. Saved anyway, check it when reviewing.`,
        );
      }

      // Status and source are set explicitly. This script must never schedule or publish.
      await prisma.story.create({
        data: {
          title: story.title,
          body: story.body,
          characters: story.characters,
          scheduledDate: nextDate,
          status: "draft",
          source: "ai",
        },
      });

      console.log(`Saved draft for ${formatDate(nextDate)}: ${story.title} (${wordCount} words)`);
      saved.push({ date: formatDate(nextDate), title: story.title });
      // Only a saved story uses up a date, so failures leave no gaps.
      nextDate = addDays(nextDate, 1);
      // Also avoid the characters from this batch in the next stories.
      avoidCharacters.push(...story.characters);
    } catch (error) {
      failed++;
      console.log(`FAILED, skipping: ${errorMessage(error)}`);
    }
  }

  console.log(`\n${"=".repeat(60)}\nSUMMARY\n${"=".repeat(60)}`);
  console.log(`Succeeded: ${saved.length}, failed: ${failed}`);
  for (const story of saved) {
    console.log(`  ${story.date}  ${story.title}`);
  }
  console.log(`Tokens: ${inputTokens} in, ${outputTokens} out`);
  const cost = estimateCost(STORY_MODEL, inputTokens, outputTokens);
  console.log(`Approx. cost: ${cost === null ? "price unknown" : `$${cost.toFixed(4)}`}`);
  console.log("\nAll stories are drafts. Review and publish them in Supabase.");
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
