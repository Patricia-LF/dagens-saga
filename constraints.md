# Constraints — Dagens saga

These are fixed. If a task seems to require breaking one of them, stop and ask.

## Time and scope

- The whole project is 5 weeks, solo. Prefer the simplest solution that meets the Must list.
- Do not build Should/Could/Won't items unless I ask for them. Do not add "nice to have" features.
- Favorites are saved on the device. There is no membership or login (decided 2026-11-04).

## Technology (decided)

- React Native with Expo, tested via Expo Go. No ejecting, no native modules that Expo Go cannot run. A standalone Android APK is built with EAS Build (profile `preview`), which is not ejecting.
- Node.js + Express with TypeScript.
- Supabase (PostgreSQL) used only as the hosted database, accessed through Prisma. Backend logic stays in my own Express code.
- Vercel hosting for the backend (serverless). Express must be written so it works as a Vercel function: no reliance on a long-running server process, and keep function run time short.
- Animations in the app use React Native Reanimated (GSAP does not work in React Native).

## Dates and the daily rotation

- "Today" is always decided by the date in the Europe/Stockholm timezone.
- Vercel Cron runs in UTC. The story-of-the-day endpoint must select by scheduled date, so it is correct even if the cron job runs late or not at all.
- AI generation must NOT run inside the cron job (time limits). Stories are generated in advance, in batches, in a separate manual step.

## AI and cost

- Text generation is the core AI feature. Image generation is optional (Should) and must not be built unless I ask.
- Keep AI API costs low: generate in advance, never on demand per user request, and make it easy to set a spending limit.
- The Claude Code budget is limited, so keep tasks small and focused.

## Children and content safety

- The audience is children, so generated stories must be age-appropriate. Every generated story is saved as a draft and reviewed by me before it is published. Never publish automatically.
- Collect as little user data as possible. No analytics, ads, or third-party trackers.
- Check each AI provider's content policy for child-oriented content before using it.

## Security

- No secrets in the repository. API keys and the database URL live in environment variables.
- Validate all input on the backend.
- There are no admin endpoints. The cron endpoint requires `CRON_SECRET`.
- Secrets (database URLs, `OPENAI_API_KEY`, `CRON_SECRET`) live in `.env`. Commit an `.env.example` with placeholder values only.
- RLS is enabled on every table with no policies, on purpose. "RLS Enabled No Policy" in Supabase's Security Advisor is expected and should not be "fixed" by adding policies. All access goes through the Express backend. Do not add GRANTs to the anon or authenticated roles. The Data API is not used, and new tables should stay unreachable through it.

## Code and language

- All code, names, comments, and commit messages are in English. App text shown to users is in Swedish.
- TypeScript strict mode. Do not add dependencies without asking.

## Design

- Builds on an existing visual identity (color palette, storybook theme, fairy characters). Styling for light and dark mode is mostly done and will be provided. Do not invent a new design.
- App images are made with AI (backgrounds, default cover), Canva free elements (fairies) or Figma AI (icons), and can be committed. No image credits are shown in the app. Every image's source is listed in `docs/image-sources.md`.
- Never offer the app's images as separate downloads or wallpapers, and never use images that require attribution, forbid commercial use or forbid use in an app. In Canva, never use Branded or Disney content.
