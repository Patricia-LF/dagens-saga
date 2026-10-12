# Issues draft — Dagens saga

Suggested setup in GitHub:

- **Milestones:** Sprint 1 to Sprint 5 (plus "Could / backlog")
- **Labels:** `must`, `should`, `could`, `mobile`, `backend`, `web`, `ai`, `docs`, `bug`
- **Project board columns:** Backlog, Sprint, In progress, Review, Done

Each issue below is: title — labels, followed by a short "done when" line.

---

## Sprint 1: Foundation

1. **Set up repo structure and docs** — `must` `docs`
   Done when: root docs, `.gitignore` (node_modules, .env, licensed images) and a README skeleton are committed.
2. **Create Expo app in `mobile/`** — `must` `mobile`
   Done when: the app runs in the browser (`w`) and on a real device via Expo Go.
3. **Define Story type and mock data layer** — `must` `mobile`
   Done when: `mobile/api/stories.ts` has `getTodaysStory()` and `getArchive()` returning 3-5 mock stories.
4. **Screen: story of the day (mock data)** — `must` `mobile`
   Done when: today's story is shown with title and text.
5. **Screen: archive list (mock data)** — `must` `mobile`
   Done when: a list of stories is shown and tapping one opens it.
6. **Screen: reading view** — `must` `mobile`
   Done when: a full story is readable and scrolls well on a phone.
7. **Set up Express + TypeScript in `backend/`** — `must` `backend`
   Done when: a `/health` endpoint works locally.
8. **Deploy backend to Vercel** — `must` `backend`
   Done when: `/health` responds on the deployed URL (as a Vercel function, root directory `backend/`).
9. **Set up Supabase and Prisma** — `must` `backend`
   Done when: a Story table exists via a Prisma migration, using the pooled `DATABASE_URL` and `DIRECT_URL`.
10. **Environment variables** — `must` `backend` `docs`
    Done when: `.env.example` exists and the README explains `.env` and how to generate `JWT_SECRET`.
11. **Test and compare text AI providers** — `must` `ai`
    Done when: 2-3 models are tested with the same prompt, results are compared (quality, cost, suitability for ages 6-12), and the decision is moved to "Decided" in `ambiguity.md`.
12. **Test setup (Vitest + Supertest)** — `must` `backend`
    Done when: one example test runs with `npm test`.

## Sprint 2: AI pipeline and story of the day

13. **Prompt template** — `must` `ai`
    Done when: a fixed template with theme, length, age and lesson produces Swedish stories of roughly 250-500 words.
14. **Batch generation script** — `must` `ai` `backend`
    Done when: a manual script generates N stories and saves them as drafts with a scheduled date.
15. **Spending limit and cost note for the AI API** — `must` `ai` `docs`
    Done when: a limit is set at the provider and the approximate cost per story is written down.
16. **Review and publish routine** — `must` `docs`
    Done when: the steps for reading a draft and changing its status in the Supabase table view are documented.
17. **Endpoint: GET /stories/today** — `must` `backend`
    Done when: it returns the story scheduled for today's date in Europe/Stockholm.
18. **Tests for scheduling logic** — `must` `backend`
    Done when: tests cover midnight, daylight saving time and a day with no story.
19. **Connect the app to /stories/today** — `must` `mobile`
    Done when: the mock for today's story is replaced with the real API call, on a real device.

## Sprint 3: Archive and daily rotation (Must complete)

20. **Endpoints: GET /stories and GET /stories/:id** — `must` `backend`
    Done when: only published stories are returned, and input is validated.
21. **Connect the archive and reading view to the API** — `must` `mobile`
    Done when: the archive uses FlatList with real data.
22. **Loading, error and empty states** — `must` `mobile`
    Done when: the app handles no network, no story today and an empty archive without crashing.
23. **Vercel Cron for the daily rotation** — `must` `backend`
    Done when: a cron job (UTC) publishes scheduled stories, and the app still works if the cron runs late.
24. **Manual device checklist** — `must` `docs`
    Done when: a short checklist exists and has been run on a real device against the deployed backend.
25. **Must checkpoint** — `must`
    Done when: all Must items work end-to-end, and the remaining time is planned.

## Sprint 4: Admin page, light/dark mode, animations

26. **Create the `web/` project (React + Vite + TS)** — `should` `web`
    Done when: it runs locally and deploys as its own Vercel project.
27. **Admin login and protected endpoints** — `should` `backend` `web`
    Done when: admin endpoints require authentication.
28. **Admin: list, create, edit and schedule stories** — `should` `web`
    Done when: stories can be edited and scheduled on desktop, with the source (ai / handwritten) marked.
29. **Admin: publish and unpublish** — `should` `web`
    Done when: status changes work without using the Supabase table view.
30. **Light/dark mode** — `should` `mobile`
    Done when: both themes work across all screens.
31. **Animations with Reanimated** — `should` `mobile`
    Done when: at least a few meaningful animations exist (for example opening a story, the star on favorites).

## Sprint 5: Membership, favorites, polish

32. **Registration and login (JWT)** — `should` `backend` `mobile`
    Done when: passwords are hashed, input is validated, and the token is stored safely in the app.
33. **Favorites (star a story)** — `should` `backend` `mobile`
    Done when: favorites are saved per user and shown in a list.
34. **Illustrations** — `should` `mobile`
    Done when: stories can show an optional image, and licensed images are kept out of git.
35. **Adobe Stock credit note in the app** — `should` `mobile` `docs`
    Done when: the note is visible in the app, and the license check is done before any public release.
36. **Testing and bug fixing** — `must` `bug`
    Done when: core endpoints and scheduling logic are tested, and the device checklist passes.
37. **Content check of published stories** — `must` `ai`
    Done when: every published story has been read and approved by me.
38. **README and AI log** — `must` `docs`
    Done when: the README explains how to run everything, and `ai-log.md` is up to date.
39. **Demo preparation** — `must` `docs`
    Done when: a short demo script and a short screen recording exist.

## Backlog (Could)

40. **Public web version** (story of the day and archive in `web/`) — `could` `web`
41. **Categories/themes and filtering in the archive** — `could` `mobile` `backend`
42. **Share the story of the day via a link** — `could` `mobile`
