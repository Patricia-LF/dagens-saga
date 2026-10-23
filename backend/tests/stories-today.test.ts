import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import { formatDate, parseDate } from "../src/stockholm-date.js";

// vi.mock is moved to the top of the file before the imports run, so the fake function
// must be created with vi.hoisted to exist by then.
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));

// Replace the real database module with a fake. The real src/db.ts is never loaded.
vi.mock("../src/db.js", () => ({
  prisma: { story: { findFirst } },
}));

const story = {
  id: 1,
  title: "Draken Fnula",
  body: "Det var en gång...",
  scheduledDate: parseDate("2026-10-21"),
  source: "ai",
  imageUrl: null,
};

// The scheduledDate (as "YYYY-MM-DD") that the route asked the database for.
function queriedDate(): string {
  const args = findFirst.mock.calls[0]?.[0];
  return formatDate(args.where.scheduledDate);
}

beforeEach(() => {
  findFirst.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("GET /stories/today", () => {
  it("returns 200 and the story with scheduledDate as YYYY-MM-DD", async () => {
    findFirst.mockResolvedValue(story);

    const res = await request(app).get("/stories/today");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.body).toEqual({ ...story, scheduledDate: "2026-10-21" });
  });

  it("returns 404 when there is no story today", async () => {
    findFirst.mockResolvedValue(null);

    const res = await request(app).get("/stories/today");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "No story today" });
  });

  it("returns 500 with a generic message and does not leak the real error", async () => {
    findFirst.mockRejectedValue(new Error("connection refused: secret-host"));
    // The error handler logs the error; silence it so the test output stays clean.
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const res = await request(app).get("/stories/today");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
    expect(res.text).not.toContain("secret-host");
    // The real error is still logged on the server.
    expect(consoleError).toHaveBeenCalled();
  });

  it("only queries scheduled and published stories and selects only the needed fields", async () => {
    findFirst.mockResolvedValue(story);

    await request(app).get("/stories/today");

    const args = findFirst.mock.calls[0]?.[0];
    expect(args.where.status).toEqual({ in: ["scheduled", "published"] });
    expect(args.where.status.in).not.toContain("draft");
    expect(args.select).toEqual({
      id: true,
      title: true,
      body: true,
      scheduledDate: true,
      source: true,
      imageUrl: true,
    });
    expect(args.select).not.toHaveProperty("characters");
    expect(args.select).not.toHaveProperty("status");
    expect(args.select).not.toHaveProperty("tier");
  });
});

describe("GET /stories/today around midnight in Stockholm", () => {
  // Only fake Date, so Supertest's real network code keeps working.
  function setNow(iso: string): void {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(iso));
  }

  beforeEach(() => {
    findFirst.mockResolvedValue(null);
  });

  it("summer time (UTC+2): 00:30 in Stockholm queries the new day", async () => {
    setNow("2026-10-21T22:30:00Z");
    await request(app).get("/stories/today");
    expect(queriedDate()).toBe("2026-10-22");
  });

  it("summer time (UTC+2): 23:30 in Stockholm still queries the old day", async () => {
    setNow("2026-10-21T21:30:00Z");
    await request(app).get("/stories/today");
    expect(queriedDate()).toBe("2026-10-21");
  });

  it("winter time (UTC+1): 00:30 in Stockholm queries the new day", async () => {
    setNow("2026-11-15T23:30:00Z");
    await request(app).get("/stories/today");
    expect(queriedDate()).toBe("2026-11-16");
  });

  it("winter time (UTC+1): 23:30 in Stockholm still queries the old day", async () => {
    setNow("2026-11-15T22:30:00Z");
    await request(app).get("/stories/today");
    expect(queriedDate()).toBe("2026-11-15");
  });
});
