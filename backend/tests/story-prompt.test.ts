import { describe, expect, it } from "vitest";
import { buildStoryPrompt, type StoryPromptInput } from "../src/ai/story-prompt.js";

const input: StoryPromptInput = {
  theme: "en drake som är rädd för mörker",
  age: 7,
  minWords: 300,
  maxWords: 450,
  lesson: "att modet växer när man delar sin rädsla",
  avoidCharacters: ["Fnula (drake)", "Vipsil (räv)"],
};

describe("buildStoryPrompt", () => {
  it("replaces all placeholders with the given values", () => {
    const prompt = buildStoryPrompt(input);

    expect(prompt).toContain("- Tema: en drake som är rädd för mörker");
    expect(prompt).toContain("- Läsarens ålder: 7 år");
    expect(prompt).toContain("ca 300 till 450 ord");
    expect(prompt).toContain("- Lärdom: att modet växer när man delar sin rädsla");
    expect(prompt).toContain("liknande: Fnula (drake), Vipsil (räv).");
    expect(prompt).not.toMatch(/\{\w+\}/);
  });

  it('writes "inga" when avoidCharacters is empty', () => {
    const prompt = buildStoryPrompt({ ...input, avoidCharacters: [] });

    expect(prompt).toContain("eller liknande: inga.");
    expect(prompt).not.toMatch(/\{\w+\}/);
  });
});
