import { describe, expect, it } from "vitest";
import { PageOptions, splitIntoPages } from "../src/utils/split-into-pages";

// A source line of up to 40 characters is one 20 px line plus a 6 px gap = 26 px.
// Every paragraph adds 16 px below it.
const options: PageOptions = {
  charsPerLine: 40,
  pageHeight: 400,
  lineHeight: 20,
  lineGap: 6,
  paragraphGap: 16,
};

describe("splitIntoPages", () => {
  it("keeps a short story on one page", () => {
    const body = "First paragraph.\n\nSecond paragraph.";
    expect(splitIntoPages(body, options)).toEqual([body]);
  });

  it("splits a long story at paragraph breaks without losing text", () => {
    // Each paragraph is 92 characters: 3 lines = 60 + 6 + 16 = 82 px, so 2 fit in 200 px
    const paragraphs = Array.from(
      { length: 6 },
      (_, i) => `Paragraph ${i + 1} ` + "x".repeat(80),
    );
    const pages = splitIntoPages(paragraphs.join("\n\n"), {
      ...options,
      pageHeight: 200,
    });

    expect(pages).toHaveLength(3);
    // Every paragraph is intact and in the original order
    expect(pages.join("\n\n").split("\n\n")).toEqual(paragraphs);
  });

  it("fits fewer paragraphs on a page of short dialogue lines", () => {
    // 3 short lines = 3 * 26 + 16 = 94 px per paragraph, so 2 fit in 200 px
    const dialogue = '"Hello," said the fox.\n"Hi," said the owl.\n"Bye!"';
    const pages = splitIntoPages(Array(5).fill(dialogue).join("\n\n"), {
      ...options,
      pageHeight: 200,
    });

    expect(pages).toEqual([
      `${dialogue}\n\n${dialogue}`,
      `${dialogue}\n\n${dialogue}`,
      dialogue,
    ]);
  });

  it("counts the line gap once per source line, not per wrapped line", () => {
    // 200 characters wrap over 5 lines: 5 * 20 + 6 + 16 = 122 px, so 2 fit in 250 px.
    // (With the gap on every wrapped line it would be 146 px and only 1 would fit.)
    const long = "z".repeat(200);
    const pages = splitIntoPages(Array(4).fill(long).join("\n\n"), {
      ...options,
      pageHeight: 250,
    });

    expect(pages).toEqual([`${long}\n\n${long}`, `${long}\n\n${long}`]);
  });

  it("gives a paragraph taller than a page a page of its own", () => {
    // 500 characters = 13 lines = 260 + 6 + 16 = 282 px, taller than 200 px
    const tall = "y".repeat(500);
    const pages = splitIntoPages(`Short one.\n\n${tall}\n\nShort two.`, {
      ...options,
      pageHeight: 200,
    });

    expect(pages).toEqual(["Short one.", tall, "Short two."]);
  });

  it("keeps single line breaks (dialogue) inside a paragraph", () => {
    const body = '"Hello," said the fox.\n"Hi," said the owl.\n\nThe end.';
    expect(splitIntoPages(body, options)).toEqual([body]);
  });

  it("returns no pages for an empty body", () => {
    expect(splitIntoPages("  \n\n  ", options)).toEqual([]);
  });

  it("puts each paragraph on its own page when there is no valid size", () => {
    const body = "One.\n\nTwo.";
    expect(
      splitIntoPages(body, { ...options, charsPerLine: 0, pageHeight: 0 }),
    ).toEqual(["One.", "Two."]);
  });
});
