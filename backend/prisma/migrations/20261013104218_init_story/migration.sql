-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('draft', 'scheduled', 'published');

-- CreateEnum
CREATE TYPE "StorySource" AS ENUM ('ai', 'handwritten');

-- CreateEnum
CREATE TYPE "StoryTier" AS ENUM ('free', 'premium');

-- CreateTable
CREATE TABLE "stories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "scheduledDate" DATE,
    "status" "StoryStatus" NOT NULL DEFAULT 'draft',
    "source" "StorySource" NOT NULL DEFAULT 'ai',
    "tier" "StoryTier" NOT NULL DEFAULT 'free',
    "imageUrl" TEXT,
    "characters" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stories_scheduledDate_key" ON "stories"("scheduledDate");
