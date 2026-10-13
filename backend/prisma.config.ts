import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// The Prisma CLI (migrate, studio) uses the direct/session connection.
// The running app uses DATABASE_URL (transaction pooler) in src/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DIRECT_URL") },
});
