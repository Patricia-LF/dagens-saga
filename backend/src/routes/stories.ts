import { Router } from "express";
import { prisma } from "../db.js";
import { formatDate, todayInStockholm } from "../stockholm-date.js";

const router = Router();

// Story of the day: scheduled for today (Stockholm) and approved (scheduled or published).
// Express 5 forwards errors from async handlers to the error handler in app.ts.
router.get("/today", async (_req, res) => {
  const story = await prisma.story.findFirst({
    where: {
      scheduledDate: todayInStockholm(),
      status: { in: ["scheduled", "published"] },
    },
    // Only the fields the app needs.
    select: {
      id: true,
      title: true,
      body: true,
      scheduledDate: true,
      source: true,
      imageUrl: true,
    },
  });

  // scheduledDate is never null here (we filtered on it); the check narrows the type.
  if (story === null || story.scheduledDate === null) {
    res.status(404).json({ error: "No story today" });
    return;
  }

  res.json({ ...story, scheduledDate: formatDate(story.scheduledDate) });
});

export default router;
