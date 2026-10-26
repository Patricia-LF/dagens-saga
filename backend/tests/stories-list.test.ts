import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import { formatDate, parseDate } from "../src/stockholm-date.js";

// vi.mock is moved to the top of the file before the imports run, so the fake functions
// must be created with vi.hoisted to exist by then.
const { findMany, findFirst } = vi.hoisted(() => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

// Replace the real database module with a fake. The real src/db.ts is never loaded.
vi.mock("../src/db.js", () => ({
  prisma: { story: { findMany, findFirst } },
}));

const story = {
  id: 5,
  title: "Draken Fnula",
  body: "Det var en gång...",
  scheduledDate: parseDate("2026-10-21"),
  source: "ai",
  imageUrl: null,
};

const listItems = [
  {
    id: 6,
    title: "Ugglan Ruff",
    scheduledDate: parseDate("2026-10-22"),
    source: "handwritten",
  },
  {
    id: 5,
    title: "Draken Fnula",
    scheduledDate: parseDate("2026-10-21"),
    source: "ai",
  },
];

// Stockholm date is 2026-10-22 (12:00 UTC is 14:00 in Stockholm).
const NOW = "2026-10-22T12:00:00Z";

beforeEach(() => {
  findMany.mockReset();
  findFirst.mockReset();
  // Only fake Date, so Supertest's real network code keeps working.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(NOW));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("GET /stories", () => {
  it("returns 200 and the stories in the order from the database, with dates as YYYY-MM-DD", async () => {
    findMany.mockResolvedValue(listItems);

    const res = await request(app).get("/stories");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 6, title: "Ugglan Ruff", scheduledDate: "2026-10-22", source: "handwritten" },
      { id: 5, title: "Draken Fnula", scheduledDate: "2026-10-21", source: "ai" },
    ]);
  });

  it("returns an empty list when there are no visible stories", async () => {
    findMany.mockResolvedValue([]);

    const res = await request(app).get("/stories");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("asks for newest first, never includes drafts, and includes today but not later dates", async () => {
    findMany.mockResolvedValue([]);

    await request(app).get("/stories");

    const args = findMany.mock.calls[0]?.[0];
    expect(args.orderBy).toEqual({ scheduledDate: "desc" });
    expect(args.where.status).toEqual({ in: ["scheduled", "published"] });
    expect(args.where.status.in).not.toContain("draft");
    // "lte" = less than or equal, so today is included and tomorrow is not.
    expect(Object.keys(args.where.scheduledDate)).toEqual(["lte"]);
    expect(formatDate(args.where.scheduledDate.lte)).toBe("2026-10-22");
  });

  it("selects only the fields the archive list needs", async () => {
    findMany.mockResolvedValue([]);

    await request(app).get("/stories");

    const args = findMany.mock.calls[0]?.[0];
    expect(args.select).toEqual({
      id: true,
      title: true,
      scheduledDate: true,
      source: true,
    });
    expect(args.select).not.toHaveProperty("body");
    expect(args.select).not.toHaveProperty("status");
    expect(args.select).not.toHaveProperty("characters");
  });

  it("returns 500 with a generic message when the database fails", async () => {
    findMany.mockRejectedValue(new Error("connection refused: secret-host"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await request(app).get("/stories");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
    expect(res.text).not.toContain("secret-host");
  });
});

describe("GET /stories/:id", () => {
  it("returns 200 and the story with scheduledDate as YYYY-MM-DD", async () => {
    findFirst.mockResolvedValue(story);

    const res = await request(app).get("/stories/5");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...story, scheduledDate: "2026-10-21" });
  });

  it("queries by the numeric id with the visibility filter and selects only the needed fields", async () => {
    findFirst.mockResolvedValue(story);

    await request(app).get("/stories/5");

    const args = findFirst.mock.calls[0]?.[0];
    expect(args.where.id).toBe(5);
    expect(args.where.status).toEqual({ in: ["scheduled", "published"] });
    expect(args.where.status.in).not.toContain("draft");
    expect(Object.keys(args.where.scheduledDate)).toEqual(["lte"]);
    expect(formatDate(args.where.scheduledDate.lte)).toBe("2026-10-22");
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

  // "99999999999" is larger than a Postgres Int.
  it.each(["abc", "0", "-1", "1.5", "12abc", "99999999999"])(
    "returns 400 for the invalid id %s and does not query the database",
    async (id) => {
      const res = await request(app).get(`/stories/${id}`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid story id" });
      expect(findFirst).not.toHaveBeenCalled();
    },
  );

  it("returns 404 when no visible story has the id (missing, draft or future date)", async () => {
    findFirst.mockResolvedValue(null);

    const res = await request(app).get("/stories/5");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Story not found" });
  });
});

describe("GET /stories/today is matched before /stories/:id", () => {
  it("treats 'today' as the story of the day, not as an id", async () => {
    findFirst.mockResolvedValue(null);

    const res = await request(app).get("/stories/today");

    // "No story today" comes from the /today route; /:id would give 400.
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "No story today" });
    const args = findFirst.mock.calls[0]?.[0];
    expect(args.where).not.toHaveProperty("id");
  });
});
