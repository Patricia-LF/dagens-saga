import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

// Uses the pooled connection (DATABASE_URL). Do not set statementNameGenerator:
// named prepared statements break with the Supabase transaction pooler.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
