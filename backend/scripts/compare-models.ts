import "dotenv/config";
import OpenAI from "openai";
import { buildStoryPrompt } from "../src/ai/story-prompt.js";
import { parseStoryResponse } from "../src/ai/parse-story-response.js";
import {
  countWords,
  estimateCost,
  generateStoryText,
} from "../src/ai/openai-story.js";

// Local script: generates one story per model with the same prompt, so we can compare them.
// Nothing is saved to the database. Run: npm run ai:compare (or: npm run ai:compare -- --list-models)
// gpt-5.5 was chosen for story generation (see ambiguity.md).
// gpt-4.1-mini was removed after the first comparison run.

const MODELS = ["gpt-5.4-mini", "gpt-5.5"];

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY is missing. Add it to backend/.env.");
  process.exit(1);
}
const client = new OpenAI({ apiKey });

async function listModels(): Promise<void> {
  const ids: string[] = [];
  for await (const model of client.models.list()) {
    if (/^(gpt|o\d)/.test(model.id)) {
      ids.push(model.id);
    }
  }
  console.log(ids.sort().join("\n"));
}

async function compareModel(model: string, prompt: string): Promise<void> {
  console.log(`\n${"=".repeat(60)}\nMODEL: ${model}\n${"=".repeat(60)}`);
  const startedAt = Date.now();

  try {
    const result = await generateStoryText(client, model, prompt);
    const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

    console.log(
      `Status: ${result.status}${result.incompleteReason ? ` (incomplete: ${result.incompleteReason})` : ""}`,
    );
    if (result.status === "incomplete") {
      console.log(
        "WARNING: the answer was cut off, so the story may be unfinished.",
      );
    }

    console.log(
      `Tokens: ${result.inputTokens} in, ${result.outputTokens} out (of which ${result.reasoningTokens} reasoning)`,
    );
    const cost = estimateCost(model, result.inputTokens, result.outputTokens);
    console.log(
      `Approx. cost: ${cost === null ? "price unknown" : `$${cost.toFixed(5)}`}`,
    );
    console.log(`Time: ${seconds}s`);

    try {
      const story = parseStoryResponse(result.text);
      console.log(`Words: ${countWords(story.body)}`);
      console.log(`Characters: ${story.characters.join(", ") || "(none)"}`);
      console.log(`\nTitle: ${story.title}\n\n${story.body}`);
    } catch (error) {
      console.log(`Could not parse the answer: ${errorMessage(error)}`);
      console.log(`Raw answer:\n${result.text}`);
    }
  } catch (error) {
    console.log(`API call failed: ${errorMessage(error)}`);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function main(): Promise<void> {
  if (process.argv.includes("--list-models")) {
    await listModels();
    return;
  }

  const prompt = buildStoryPrompt({
    theme: "en groda som inte kunde hoppa",
    age: 6,
    minWords: 250,
    maxWords: 350,
    lesson: "att alla är speciella på sitt eget sätt",
    avoidCharacters: [],
  });

  // One model at a time keeps the output readable and is easy to stop with Ctrl+C.
  for (const model of MODELS) {
    await compareModel(model, prompt);
  }
}

await main();
