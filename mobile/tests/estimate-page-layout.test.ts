import { describe, expect, it } from "vitest";
import { estimatePageLayout } from "../src/utils/estimate-page-layout";

describe("estimatePageLayout", () => {
  it("estimates characters per line and keeps the page height", () => {
    // 360 / (18 * 0.5) = 40 chars, times 0.9 for word wrapping = 36
    expect(estimatePageLayout(360, 560, 18, 28)).toEqual({
      charsPerLine: 36,
      pageHeight: 560,
    });
  });

  it("fits more characters on a wider page", () => {
    const base = estimatePageLayout(360, 560, 18, 28).charsPerLine;
    expect(estimatePageLayout(600, 560, 18, 28).charsPerLine).toBeGreaterThan(
      base,
    );
  });

  it("fits fewer characters when the font is larger", () => {
    const base = estimatePageLayout(360, 560, 18, 28).charsPerLine;
    expect(estimatePageLayout(360, 560, 27, 42).charsPerLine).toBeLessThan(
      base,
    );
  });

  it("gives a whole number of characters per line", () => {
    const { charsPerLine } = estimatePageLayout(333, 517, 17.5, 27.3);
    expect(Number.isInteger(charsPerLine)).toBe(true);
  });

  it("returns zeros for a zero, negative or invalid size", () => {
    const zeros = { charsPerLine: 0, pageHeight: 0 };
    expect(estimatePageLayout(0, 560, 18, 28)).toEqual(zeros);
    expect(estimatePageLayout(360, -1, 18, 28)).toEqual(zeros);
    expect(estimatePageLayout(360, 560, 0, 28)).toEqual(zeros);
    expect(estimatePageLayout(360, 560, 18, NaN)).toEqual(zeros);
  });
});
