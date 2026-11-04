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

## Should (in priority order, updated 2026-11-04 after supervision)

1. Book-like reading view — cover page, page turning with swipe and arrows, and a setting to choose between turning pages and scrolling
2. Animations (React Native Reanimated)
3. Light/dark mode toggle
4. Favorites saved on the device, without login
5. Web version of the app in the browser
6. Illustrations - an image per story

## Could

- Web version of the app — public pages (story of the day, archive) added to the same `web/` project as the admin page
- Categories/themes and filtering in the archive
- Sharing the story of the day via a link

## Won't (not in this project)

- Publishing to App Store / Google Play
- Paid membership / payments
- Text-to-speech narration
- A built-in writing tool for stories (content goes through the admin page or the database)
- Membership and login - a child should be able to open the app and read right away. Without paid features, an account would only be an obstacle.
- Admin page - stories are reviewed and edited in the Supabase table view, which works well.

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

## Later (after the thesis)

- A real website for Dagens saga, built as a separate web project (for example React + Vite), using the same backend API. Not part of the thesis, since it would mean building the whole interface twice. The Expo app in the browser covers the web for now.
- Login and paid membership. If paid content is added (for example premium stories), accounts become worthwhile. The Story model already has a `tier` field (free/premium) prepared for this. Favorites would then move from the device to the account, so they follow the user between devices. Favorites already saved on a device could be moved to the account at the first login.
