import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import { formatDate } from "../src/stockholm-date.js";

// vi.mock is moved to the top of the file before the imports run, so the fake function
// must be created with vi.hoisted to exist by then.
const { updateMany } = vi.hoisted(() => ({ updateMany: vi.fn() }));

// Replace the real database module with a fake. The real src/db.ts is never loaded.
vi.mock("../src/db.js", () => ({
  prisma: { story: { updateMany } },
}));

const SECRET = "test-secret-1234567890";

beforeEach(() => {
  updateMany.mockReset();
  updateMany.mockResolvedValue({ count: 2 });
  vi.stubEnv("CRON_SECRET", SECRET);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("GET /cron/publish authentication", () => {
  it("returns 401 without an Authorization header, and never calls the database", async () => {
    const res = await request(app).get("/cron/publish");

    expect(res.status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("returns 401 with a wrong secret, and never calls the database", async () => {
    const res = await request(app)
      .get("/cron/publish")
      .set("Authorization", "Bearer wrong-secret");

    expect(res.status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("returns 401 when the secret is sent without the Bearer prefix", async () => {
    const res = await request(app).get("/cron/publish").set("Authorization", SECRET);

    expect(res.status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("refuses every request when CRON_SECRET is not set on the server", async () => {
    vi.stubEnv("CRON_SECRET", "");

    // "Bearer " and "Bearer undefined" are what a naive comparison would let through.
    for (const header of ["Bearer ", "Bearer undefined", "Bearer"]) {
      const res = await request(app).get("/cron/publish").set("Authorization", header);
      expect(res.status).toBe(401);
    }
    const withoutHeader = await request(app).get("/cron/publish");
    expect(withoutHeader.status).toBe(401);
    expect(updateMany).not.toHaveBeenCalled();
  });
});

describe("GET /cron/publish", () => {
  function callWithSecret() {
    return request(app).get("/cron/publish").set("Authorization", `Bearer ${SECRET}`);
  }

  it("returns 200 and the number of published stories with the right secret", async () => {
    const res = await callWithSecret();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ published: 2 });
  });

  it("only changes scheduled stories to published, never drafts", async () => {
    await callWithSecret();

    expect(updateMany).toHaveBeenCalledTimes(1);
    const args = updateMany.mock.calls[0]?.[0];
    expect(args.where.status).toBe("scheduled");
    expect(args.data).toEqual({ status: "published" });
  });

  it("filters on a date up to and including today in Stockholm (not future dates)", async () => {
    // Only fake Date, so Supertest's real network code keeps working.
    vi.useFakeTimers({ toFake: ["Date"] });
    // 23:30 UTC in winter (UTC+1) is 00:30 on the 16th in Stockholm.
    vi.setSystemTime(new Date("2026-11-15T23:30:00Z"));

    await callWithSecret();

    const args = updateMany.mock.calls[0]?.[0];
    expect(Object.keys(args.where.scheduledDate)).toEqual(["lte"]);
    expect(formatDate(args.where.scheduledDate.lte)).toBe("2026-11-16");
  });

  it("uses the Stockholm date also in summer time (UTC+2)", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    // 22:30 UTC in summer is 00:30 on the 22nd in Stockholm.
    vi.setSystemTime(new Date("2026-06-21T22:30:00Z"));

    await callWithSecret();

    const args = updateMany.mock.calls[0]?.[0];
    expect(formatDate(args.where.scheduledDate.lte)).toBe("2026-06-22");
  });

  it("returns 500 with a generic message when the database fails", async () => {
    updateMany.mockRejectedValue(new Error("connection refused: secret-host"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await callWithSecret();

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
    expect(res.text).not.toContain("secret-host");
  });
});
