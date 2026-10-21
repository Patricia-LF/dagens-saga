import express, { type ErrorRequestHandler } from "express";
import storiesRouter from "./routes/stories.js";

const app = express();

app.use(express.json());

// Does not touch the database, so it can be used as a simple liveness check.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/stories", storiesRouter);

// Must be registered last. Express treats a middleware with 4 parameters as an error handler.
// The real error is logged on the server only; the client gets a generic message.
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);

export default app;
