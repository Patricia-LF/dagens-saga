import type OpenAI from "openai";

// The model chosen for story generation (see ambiguity.md).
export const STORY_MODEL = "gpt-5.5";

// Price in USD per 1 million tokens. Check https://openai.com/api/pricing before trusting the cost.
// Models that are missing here get no cost estimate.
const PRICES: Record<string, { input: number; output: number }> = {
  "gpt-5.4-mini": { input: 0.75, output: 4.5 },
  "gpt-5.5": { input: 5.0, output: 30.0 },
};

// Stops a runaway answer. A 350-word Swedish story is roughly 600 tokens.
// gpt-5 models also spend tokens on hidden reasoning inside this limit.
const MAX_OUTPUT_TOKENS = 2000;

export interface StoryTextResult {
  text: string;
  // "completed", or "incomplete" if the answer was cut off (for example by MAX_OUTPUT_TOKENS).
  status: string;
  incompleteReason: string | null;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
}

// Sends one prompt to the OpenAI Responses API. API errors are thrown to the caller.
export async function generateStoryText(
  client: OpenAI,
  model: string,
  prompt: string,
): Promise<StoryTextResult> {
  const response = await client.responses.create({
    model,
    input: prompt,
    max_output_tokens: MAX_OUTPUT_TOKENS,
    // The gpt-5 models are reasoning models. Low effort keeps the hidden thinking (and cost) small.
    ...(model.startsWith("gpt-5")
      ? { reasoning: { effort: "low" as const } }
      : {}),
  });

  return {
    text: response.output_text,
    status: response.status ?? "unknown",
    incompleteReason: response.incomplete_details?.reason ?? null,
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
    reasoningTokens: response.usage?.output_tokens_details.reasoning_tokens ?? 0,
  };
}

// Approximate cost in USD, or null if the model's price is unknown.
export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number | null {
  const price = PRICES[model];
  if (!price) {
    return null;
  }
  return (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word !== "").length;
}
