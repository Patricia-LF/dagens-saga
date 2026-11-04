// An average character is about half as wide as the font size is tall (typical for Comic Neue)
const AVERAGE_CHAR_WIDTH = 0.5;

// Words wrap before the end of a line, so only count 80% of the width
const LINE_FILL = 0.9;

export type PageLayout = {
  charsPerLine: number;
  pageHeight: number; // px
};

// Estimates how much text fits on a page of the given size: how many characters
// fit on one line, and how many pixels of height there are.
// All values are in pixels. Pass the area the text can really use (page size minus
// any padding) and the font size and line height as they are drawn (including the
// phone's text size setting). Returns zeros for an invalid size.
export function estimatePageLayout(
  width: number,
  height: number,
  fontSize: number,
  lineHeight: number,
): PageLayout {
  const valid = [width, height, fontSize, lineHeight].every(
    (value) => Number.isFinite(value) && value > 0,
  );
  if (!valid) return { charsPerLine: 0, pageHeight: 0 };

  return {
    charsPerLine: Math.floor(
      (width / (fontSize * AVERAGE_CHAR_WIDTH)) * LINE_FILL,
    ),
    pageHeight: height,
  };
}
