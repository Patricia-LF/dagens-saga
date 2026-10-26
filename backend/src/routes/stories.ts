import { Router } from "express";
import { prisma } from "../db.js";
import type { StoryStatus } from "../generated/prisma/client.js";
import { formatDate, todayInStockholm } from "../stockholm-date.js";

const router = Router();

// The visibility rule, written once and used by all routes: a story is visible in the app
// when it is approved (scheduled or published) and its date has come (up to and including
// today in Stockholm). Drafts and future dates are never shown.
// In SQL, NULL <= date is never true, so unscheduled drafts are excluded by the date filter too.
function visibleWhere(today: Date) {
  return {
    status: { in: ["scheduled", "published"] as StoryStatus[] },
    scheduledDate: { lte: today },
  };
}

// Only the fields the reading view needs.
const storySelect = {
  id: true,
  title: true,
  body: true,
  scheduledDate: true,
  source: true,
  imageUrl: true,
} as const;

// Postgres Int (the type of Story.id) can not hold larger numbers.
const MAX_ID = 2147483647;

// scheduledDate is never null for visible stories (we filter on it); the check narrows the type.
function formatScheduledDate(date: Date | null): string {
  if (date === null) {
    throw new Error("Visible story without a scheduled date");
  }
  return formatDate(date);
}

// Express 5 forwards errors from async handlers to the error handler in app.ts.

// Archive list: all visible stories, newest first.
router.get("/", async (_req, res) => {
  const stories = await prisma.story.findMany({
    where: visibleWhere(todayInStockholm()),
    orderBy: { scheduledDate: "desc" },
    select: { id: true, title: true, scheduledDate: true, source: true },
  });

  res.json(
    stories.map((story) => ({
      ...story,
      scheduledDate: formatScheduledDate(story.scheduledDate),
    })),
  );
});

// Story of the day: visible and scheduled for exactly today.
// Must be registered before "/:id", otherwise "today" would be treated as an id.
router.get("/today", async (_req, res) => {
  const today = todayInStockholm();
  const story = await prisma.story.findFirst({
    where: { ...visibleWhere(today), scheduledDate: today },
    select: storySelect,
  });

  if (story === null || story.scheduledDate === null) {
    res.status(404).json({ error: "No story today" });
    return;
  }

  res.json({ ...story, scheduledDate: formatDate(story.scheduledDate) });
});

// One visible story. A missing id, a draft and a future story all give the same 404,
// so the response never reveals that a draft or a future story exists.
router.get("/:id", async (req, res) => {
  // Digits only, no leading zero: rejects "abc", "0", "-1", "1.5" and "12abc".
  const idText = req.params.id;
  if (!/^[1-9]\d*$/.test(idText) || Number(idText) > MAX_ID) {
    res.status(400).json({ error: "Invalid story id" });
    return;
  }

  const story = await prisma.story.findFirst({
    where: { id: Number(idText), ...visibleWhere(todayInStockholm()) },
    select: storySelect,
  });

  if (story === null) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  res.json({ ...story, scheduledDate: formatScheduledDate(story.scheduledDate) });
});

export default router;
