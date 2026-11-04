// Everything is in pixels, and matches how StoryText draws the text
export type PageOptions = {
  charsPerLine: number; // how many characters fit on one line
  pageHeight: number; // the height a page can use
  lineHeight: number; // height of one line of text
  lineGap: number; // space below every source line (one line break in the text)
  paragraphGap: number; // space below every paragraph
};

// Height of a paragraph as StoryText draws it. Every source line (a line break in the
// text, for example one line of dialogue) takes at least one line, and a long line
// wraps over several. The line gap is added once per source line, not per wrapped line.
function paragraphHeight(paragraph: string, options: PageOptions): number {
  const { charsPerLine, lineHeight, lineGap, paragraphGap } = options;
  let height = paragraphGap;
  for (const line of paragraph.split("\n")) {
    const wrappedLines = Math.max(
      1,
      Math.ceil(line.trim().length / charsPerLine),
    );
    height += wrappedLines * lineHeight + lineGap;
  }
  return height;
}

// Splits a story body into pages at paragraph breaks (blank lines).
// A paragraph is never split: a paragraph taller than a page gets a page of its own.
// Each page is a string with paragraphs separated by a blank line, so it can be
// passed straight to StoryText.
export function splitIntoPages(body: string, options: PageOptions): string[] {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  // Without a valid size, nothing can be measured: one paragraph per page
  if (options.charsPerLine <= 0 || options.pageHeight <= 0) return paragraphs;

  const pages: string[] = [];
  let current = "";
  let currentHeight = 0;

  for (const paragraph of paragraphs) {
    const height = paragraphHeight(paragraph, options);

    if (current === "") {
      current = paragraph;
      currentHeight = height;
    } else if (currentHeight + height <= options.pageHeight) {
      current += "\n\n" + paragraph; // still fits on this page
      currentHeight += height;
    } else {
      pages.push(current);
      current = paragraph;
      currentHeight = height;
    }
  }

  if (current !== "") pages.push(current);
  return pages;
}
