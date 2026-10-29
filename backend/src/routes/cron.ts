import { Router } from "express";
import { prisma } from "../db.js";
import { todayInStockholm } from "../stockholm-date.js";

const router = Router();

// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set in the project.
// The secret is read on every request (not once at startup). If it is not set on the server,
// every request is refused, so a missing setting can never leave the endpoint open.
// This runs before any route in this router, so the database is never reached without the secret.
router.use((req, res, next) => {
  const secret = process.env.CRON_SECRET;

  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
});

// Clean-up only: scheduled -> published for stories whose date has come (Stockholm).
// The app already shows scheduled stories, so it keeps working if this runs late or not at all.
// Safe to run twice, and a missed day is caught up by the next run (date is "up to and including today").
// Drafts are never touched (status must be scheduled), and neither are future dates.
// Stories are never generated here (see constraints.md).
router.get("/publish", async (_req, res) => {
  const result = await prisma.story.updateMany({
    where: { status: "scheduled", scheduledDate: { lte: todayInStockholm() } },
    data: { status: "published" },
  });

  res.json({ published: result.count });
});

export default router;
