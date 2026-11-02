import { describe, expect, it } from "vitest";
import { pickThemes } from "../src/ai/pick-themes.js";
import type { StoryTheme } from "../src/ai/themes.js";

const allThemes: StoryTheme[] = [
  { theme: "en drake", lesson: "mod" },
  { theme: "en räv", lesson: "ärlighet" },
  { theme: "en fjäril", lesson: "tålamod" },
  { theme: "en uggla", lesson: "vänskap" },
];

describe("pickThemes", () => {
  it("picks the requested number of themes from the list when none are used", () => {
    const picked = pickThemes(allThemes, [], 3);

    expect(picked).toHaveLength(3);
    for (const theme of picked) {
      expect(allThemes).toContain(theme);
    }
  });

  it("never picks a used theme", () => {
    // Repeat, because the pick is random.
    for (let run = 0; run < 20; run++) {
      const picked = pickThemes(allThemes, ["en drake", "en räv"], 2);

      expect(picked.map((t) => t.theme).sort()).toEqual(["en fjäril", "en uggla"]);
    }
  });

  it("throws when all themes are used", () => {
    const used = allThemes.map((t) => t.theme);

    expect(() => pickThemes(allThemes, used, 1)).toThrow(
      "Only 0 unused themes left. Add more to src/ai/themes.ts.",
    );
  });

  it("throws with the number left when there are fewer unused themes than count", () => {
    expect(() => pickThemes(allThemes, ["en drake", "en räv"], 3)).toThrow(
      "Only 2 unused themes left. Add more to src/ai/themes.ts.",
    );
  });

  it("does not pick the same theme twice", () => {
    for (let run = 0; run < 20; run++) {
      const picked = pickThemes(allThemes, [], allThemes.length);
      const names = picked.map((t) => t.theme);

      expect(new Set(names).size).toBe(allThemes.length);
    }
  });

  it("compares themes exactly as written", () => {
    // Different case means a different theme, so it is not treated as used.
    const picked = pickThemes(allThemes, ["En drake"], 4);

    expect(picked).toHaveLength(4);
  });
});
