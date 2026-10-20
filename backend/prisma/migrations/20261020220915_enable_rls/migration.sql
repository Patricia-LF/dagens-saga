-- Block all access through Supabase's public Data API.
-- The backend connects as the table owner, so it is not affected.
ALTER TABLE "stories" ENABLE ROW LEVEL SECURITY;

-- Prisma's own bookkeeping table does not exist in the shadow database,
-- so only enable RLS on it where it exists.
DO $$
BEGIN
  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;