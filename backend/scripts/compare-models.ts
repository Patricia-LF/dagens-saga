import "dotenv/config";
import OpenAI from "openai";
import { buildStoryPrompt } from "../src/ai/story-prompt.js";
import { parseStoryResponse } from "../src/ai/parse-story-response.js";

// Local script: generates one story per model with the same prompt, so we can compare them.
// Nothing is saved to the database. Run: npm run ai:compare (or: npm run ai:compare -- --list-models)

const MODELS = ["gpt-5.4-mini", "gpt-5.5"];

// Price in USD per 1 million tokens. Check https://openai.com/api/pricing before trusting the cost.
// Models that are missing here are printed with "price unknown".
// gpt-5.5 was chosen for story generation (see ambiguity.md).
// gpt-4.1-mini was removed after the first comparison run.
const PRICES: Record<string, { input: number; output: number }> = {
  "gpt-5.4-mini": { input: 0.75, output: 4.5 },
  "gpt-5.5": { input: 5.0, output: 30.0 },
};

// Stops a runaway answer. A 350-word Swedish story is roughly 600 tokens.
// gpt-5 models also spend tokens on hidden reasoning inside this limit.
const MAX_OUTPUT_TOKENS = 2000;

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
    const response = await client.responses.create({
      model,
      input: prompt,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      // The gpt-5 models are reasoning models. Low effort keeps the hidden thinking (and cost) small.
      ...(model.startsWith("gpt-5")
        ? { reasoning: { effort: "low" as const } }
        : {}),
    });
    const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

    const incompleteReason = response.incomplete_details?.reason;
    console.log(
      `Status: ${response.status}${incompleteReason ? ` (incomplete: ${incompleteReason})` : ""}`,
    );
    if (response.status === "incomplete") {
      console.log(
        "WARNING: the answer was cut off, so the story may be unfinished.",
      );
    }

    const usage = response.usage;
    if (usage) {
      const reasoningTokens = usage.output_tokens_details.reasoning_tokens;
      console.log(
        `Tokens: ${usage.input_tokens} in, ${usage.output_tokens} out (of which ${reasoningTokens} reasoning)`,
      );
      const price = PRICES[model];
      if (price) {
        const cost =
          (usage.input_tokens * price.input +
            usage.output_tokens * price.output) /
          1_000_000;
        console.log(`Approx. cost: $${cost.toFixed(5)}`);
      } else {
        console.log("Approx. cost: price unknown");
      }
    }
    console.log(`Time: ${seconds}s`);

    try {
      const story = parseStoryResponse(response.output_text);
      const wordCount = story.body
        .split(/\s+/)
        .filter((word) => word !== "").length;
      console.log(`Words: ${wordCount}`);
      console.log(`Characters: ${story.characters.join(", ") || "(none)"}`);
      console.log(`\nTitle: ${story.title}\n\n${story.body}`);
    } catch (error) {
      console.log(`Could not parse the answer: ${errorMessage(error)}`);
      console.log(`Raw answer:\n${response.output_text}`);
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
