import { describe, expect, it } from "vitest";
import { parseStoryResponse } from "../src/ai/parse-story-response.js";

describe("parseStoryResponse", () => {
  it("parses a normal response", () => {
    const response = [
      "Drakens lilla lykta",
      "",
      "Fnula bodde i en grotta.",
      "",
      "– Jag är rädd, sa hon.",
      "– Jag följer med dig, sa Vipsil.",
      "",
      "Tillsammans gick de ut i natten.",
      "",
      "Figurer: Fnula (drake), Vipsil (räv)",
    ].join("\n");

    expect(parseStoryResponse(response)).toEqual({
      title: "Drakens lilla lykta",
      body: [
        "Fnula bodde i en grotta.",
        "",
        "– Jag är rädd, sa hon.",
        "– Jag följer med dig, sa Vipsil.",
        "",
        "Tillsammans gick de ut i natten.",
      ].join("\n"),
      characters: ["Fnula (drake)", "Vipsil (räv)"],
    });
  });

  it("returns an empty characters list when the Figurer line is missing", () => {
    const result = parseStoryResponse("Titel här\n\nFörsta stycket.\n\nSista stycket.");

    expect(result.title).toBe("Titel här");
    expect(result.body).toBe("Första stycket.\n\nSista stycket.");
    expect(result.characters).toEqual([]);
  });

  it("strips ** and a Titel: prefix from the title", () => {
    const bold = parseStoryResponse("**Drakens lykta**\n\nEn text.\n\nFigurer: Fnula (drake)");
    const prefixed = parseStoryResponse('Titel: "Drakens lykta"\n\nEn text.');

    expect(bold.title).toBe("Drakens lykta");
    expect(prefixed.title).toBe("Drakens lykta");
  });

  it("separates paragraphs with exactly one blank line", () => {
    const response = "\n\nTitel\n\n\n\nFörsta.\n\n\n\nAndra.\n\n\n\nFigurer: Fnula (drake)\n\n";

    expect(parseStoryResponse(response).body).toBe("Första.\n\nAndra.");
  });

  it("throws on an empty response", () => {
    expect(() => parseStoryResponse("")).toThrow("no title");
    expect(() => parseStoryResponse("  \n \n")).toThrow("no title");
  });

  it("throws when there is a title but no body", () => {
    expect(() => parseStoryResponse("Bara en titel")).toThrow("no story body");
    expect(() => parseStoryResponse("Titel\n\nFigurer: Fnula (drake)")).toThrow("no story body");
  });
});
