# Scope — Dagens saga

## MVP

A child (or parent) opens the app and gets a new story every day, and can go back and read older ones.

## Must (done by the end of sprint 3)

- **AI pipeline** — generates story text from a fixed prompt template (variables: theme, length, target age) and saves it as a draft.
- **Story of the day** — a new story is published automatically every day, selected by its scheduled date.
- **Archive** — list of all published stories, and a reading view for any of them.
- **Mobile app** — React Native (Expo), running on a real device via Expo Go, connected to the deployed backend.

Every AI-generated story must be editable before it is published (title and text, for example to fix spelling or wording). Until the admin page exists, drafts are edited, reviewed and published directly in the Supabase table view. The admin page later makes this easier on desktop.

## Story format

- Swedish, for ages 6-12
- About half to one A4 page (roughly 250-500 words), never longer
- Lots of magic and fantasy, ideally with a lesson or something useful for children
- Prompt template variables: theme, length, age, lesson

## Should (in rough priority order)

1. Admin page — in the `web/` project (React + Vite), under `/admin`, built for desktop, to create/edit/schedule stories and mark source (AI-generated or handwritten)
2. Membership — registration and login
3. Favorites — star stories, saved per logged-in user
4. Light/dark mode (styling is already mostly done)
5. Animations (React Native Reanimated)
6. Illustrations — an image per story (stock images already licensed, my own paintings, or AI-generated). The data model has an optional image field from the start.

## Could

- Web version of the app — public pages (story of the day, archive) added to the same `web/` project as the admin page
- Categories/themes and filtering in the archive
- Sharing the story of the day via a link

## Won't (not in this project)

- Publishing to App Store / Google Play
- Paid membership / payments
- Text-to-speech narration
- A built-in writing tool for stories (content goes through the admin page or the database)

## Data model (initial idea)

- Story: id, title, body, scheduled date, status (draft / scheduled / published), source (ai / handwritten), tier (free / premium, prepared but unused), optional image URL, characters (list of characters as name and kind, e.g. "Fnula (dragon)", used later to avoid repeating characters across stories), created at, updated at
  - Scheduled date is a calendar date (no time) in Europe/Stockholm, unique (at most one story per day), empty for unscheduled drafts. New stories default to status draft.
- User and Favorite: added only when membership is built

## Sprint overview (5 weeks)

1. Foundation: set up Expo app, Express backend, Supabase and Prisma; app shows mocked data (a small API layer in `mobile/api/stories.ts` with `getTodaysStory()` and `getArchive()` returning mock stories first, later swapped to real API calls without changing the screens). Preview in the browser with `npx expo start` and `w`, and check on a real device via Expo Go.
2. AI pipeline and story of the day, end-to-end
3. Archive and daily rotation (Must complete)
4. Admin page, light/dark mode, animations
5. Membership, favorites, illustrations (if time allows), testing, bug fixing, documentation, demo

## Definition of done

- All Must items work end-to-end on a real device against the deployed backend.
- The daily rotation works without manual action.
- Core endpoints and the scheduling logic are tested.
- Secrets are kept out of the repository, input is validated, and AI content is reviewed before it is published.
- README explains how to run the project, including how to set up `.env` (with an `.env.example`) and how to generate the JWT secret, and the AI log is up to date.
