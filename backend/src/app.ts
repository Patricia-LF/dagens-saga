import express from "express";

const app = express();

app.use(express.json());

// Does not touch the database, so it can be used as a simple liveness check.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
