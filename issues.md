# Issues — Dagens saga

Suggested setup in GitHub:

- **Milestones:** Sprint 1 to Sprint 5 (plus "Could / backlog")
- **Labels:** `must`, `should`, `could`, `mobile`, `backend`, `web`, `ai`, `docs`, `bug`
- **Project board columns:** Backlog, Sprint, In progress, Review, Done

Each issue has a short **Description** (what and why), **Scope** (what is included), **Out of scope** where it helps to draw a line, **Technical notes** where there is something worth knowing in advance, and **Acceptance criteria** as a checklist. Smaller issues have fewer sections.

Issue numbers are kept stable. New issues are added at the end (43 and up) instead of renumbering.

---

## Sprint 1: Foundation (done)

1. **Set up repo structure and docs** — `must` `docs` ✅
2. **Create Expo app in `mobile/`** — `must` `mobile` ✅
3. **Define Story type and mock data layer** — `must` `mobile` ✅
4. **Screen: story of the day (mock data)** — `must` `mobile` ✅
5. **Screen: archive list (mock data)** — `must` `mobile` ✅
6. **Screen: reading view** — `must` `mobile` ✅
7. **Set up Express + TypeScript in `backend/`** — `must` `backend` ✅
8. **Deploy backend to Vercel** — `must` `backend` ✅
9. **Set up Supabase and Prisma** — `must` `backend` ✅
10. **Environment variables** — `must` `backend` `docs` ✅
11. **Test and compare text AI providers** — `must` `ai` ✅
12. **Test setup (Vitest + Supertest)** — `must` `backend` ✅

---

## Sprint 2: AI pipeline and story of the day

### 13. Prompt template ✅

`must` `ai`

**Description**
A fixed prompt template in code that turns a few variables into a complete story prompt. This is what makes the stories consistent in length, language and tone, and it is the base for the batch script.

**Scope**

- The Swedish prompt from the AI comparison, moved into code as a template.
- Variables: theme, age, min/max words, lesson, and a list of characters to avoid.
- A parser that reads the AI response into title, body and characters, based on the agreed output format (title line, blank line, story in paragraphs, then a "Figurer:" line).

**Technical notes**

- Keep the template and the parser as small pure functions, so they are easy to test without calling the API.
- Dialogue: each line on its own row starting with a dash, as in the prompt.

**Acceptance criteria**

- [ ] The template produces the full prompt from the variables.
- [ ] The parser returns title, body and characters from a sample response.
- [ ] Unit tests for the parser, including a response without a "Figurer:" line.
- [ ] A test run gives Swedish stories of roughly 250–500 words.

---

### 14. Batch generation script ✅

`must` `ai` `backend`

**Description**
A script I run manually that generates several stories at once and saves them as drafts. Every story must be read and approved before it is published, so generation never happens automatically.

**Scope**

- Run from the terminal, for example `npm run generate -- --count 7`.
- Calls the OpenAI API with the prompt template, one story per call.
- Saves each story as `status: draft`, `source: ai`, with the characters stored.
- Gives each draft a suggested `scheduledDate` (the next free days), which I can change before approving.
- Passes the characters from recent stories as "avoid" to reduce repetition.

**Out of scope**

- Running from the cron job or from the app.
- Images.

**Technical notes**

- Choose the exact OpenAI model here, after a short API test (see ambiguity.md). Write the choice and reason in ambiguity.md.
- The API key goes in `.env` as `OPENAI_API_KEY` (and in `.env.example` without a value). Never in code.
- One failed story should not stop the whole batch. Log the error and continue.

**Acceptance criteria**

- [ ] The script generates N drafts that show up in the Supabase table view.
- [ ] No story is published by the script.
- [ ] The API key is read from `.env` and is not in git.
- [ ] The model choice is documented in ambiguity.md.

---

### 15. Spending limit and cost note for the AI API ✅

`must` `ai` `docs`

**Description**
Make sure a bug or a mistake can never run up a large bill, and know roughly what each story costs.

**Scope**

- A monthly spending limit set in the OpenAI dashboard. Spending limit: $5 in prepaid credits with auto-recharge turned off, so the API can never cost more than that.
- The approximate cost per story, measured from a real batch, written down. Cost per story: to be measured after the first batch (issue 14).

**Acceptance criteria**

- [ ] A spending limit is set at OpenAI.
- [ ] The cost per story is noted in the README or ai-log.md.

---

### 16. Review, edit and publish routine ✅

`must` `docs`

**Description**
A written routine for how a draft becomes a published story, so the review step is never skipped. Until the admin page exists, this is done in the Supabase table view.

**Scope**

- Steps: find drafts, read the story, fix the title and text, check the date, change the status.
- A short checklist for the content: age-appropriate, kind tone, no repeated characters, correct Swedish.

**Acceptance criteria**

- [ ] The routine is documented (for example `docs/review-routine.md`).
- [ ] I have followed it once on a real draft.

---

### 17. Endpoint: GET /stories/today ✅

`must` `backend`

**Description**
The endpoint the app calls to get today's story. "Today" is always the date in Sweden, not on the server, which runs in UTC.

**Scope**

- Returns the story whose `scheduledDate` is today's date in Europe/Stockholm.
- Only returns stories that are approved (not drafts).
- Returns 404 with a clear message if there is no story for today.

**Technical notes**

- Put the date logic in its own small function (for example `todayInStockholm()`), so it can be tested on its own (issue 18).
- To decide: should the endpoint return stories with status `scheduled` as well as `published`? If yes, the app keeps working even if the cron job (issue 23) runs late. Check this before implementing.
- First endpoint that uses the database. The Vercel build already runs `prisma generate`.

**Acceptance criteria**

- [ ] Returns today's story locally and on the deployed URL.
- [ ] Drafts are never returned.
- [ ] Returns 404 on a day without a story.
- [ ] Only the fields the app needs are returned.

---

### 18. Tests for scheduling logic ✅

`must` `backend`

**Description**
The date logic is the easiest part to get subtly wrong, and wrong at exactly the wrong time (around midnight or when the clocks change). Tests make sure today's story really is today's.

**Scope**

- Tests for the "today in Stockholm" function with fixed times.
- Tests for GET /stories/today with Supertest.

**Technical notes**

- Use fixed times instead of the real clock (Vitest has fake timers).
- Cases: just before and just after midnight Swedish time (which is 22:00 or 23:00 UTC), the day the clocks go forward and the day they go back, and a day without a story.

**Acceptance criteria**

- [ ] Tests cover midnight, both daylight saving changes and a day without a story.
- [ ] `npm test` passes.
- [ ] I have read the tests and can explain what each one checks.

---

### 19. Connect the app to /stories/today

`must` `mobile`

**Description**
Replace the mock for today's story with a real call to the deployed backend. The screens don't change, only the API layer.

**Scope**

- `getTodaysStory()` in `mobile/src/api/stories.ts` calls the backend instead of returning mock data.
- The backend address comes from configuration, not hard-coded in several places.
- The 404 from the backend shows the existing "no story today" state.

**Out of scope**

- The archive and reading view (issue 21).
- Full error handling for lost network (issue 22).

**Technical notes**

- Expo reads environment variables that start with `EXPO_PUBLIC_`, for example `EXPO_PUBLIC_API_URL`. These end up in the app, so they must never contain secrets.
- Remove the date logic from the mock layer, since the backend now decides what "today" is.

**Acceptance criteria**

- [ ] The app shows today's story from the database, on a real phone via Expo Go.
- [ ] A day without a story shows "no story today" without crashing.
- [ ] The backend URL is set in one place.

---

## Sprint 3: Archive and daily rotation (Must complete)

### 20. Endpoints: GET /stories and GET /stories/:id

`must` `backend`

**Description**
The archive needs a list of all published stories, and the reading view needs a single story.

**Scope**

- `GET /stories`: published stories, newest first, with only the fields the list needs (id, title, date).
- `GET /stories/:id`: one published story with its full text.
- Validation: the id must be a positive integer.

**Technical notes**

- Never return stories with a future `scheduledDate`, even if they are approved. Otherwise the archive would reveal tomorrow's story.
- Invalid id → 400. Unknown id, draft or future story → 404.

**Acceptance criteria**

- [ ] Only published stories with a date up to and including today are returned.
- [ ] Invalid ids give 400, missing stories give 404.
- [ ] Tests cover the list, a valid id, an invalid id and a draft.

---

### 21. Connect the archive and reading view to the API

`must` `mobile`

**Description**
Replace the remaining mock data, so the whole app runs on real data.

**Scope**

- `getArchive()` and `getStory(id)` call the backend.
- The mock data is removed, or kept only for tests.

**Acceptance criteria**

- [ ] The archive uses FlatList with real data and scrolls smoothly.
- [ ] Tapping a story opens it in the reading view.
- [ ] Works on a real phone via Expo Go.

---

### 22. Loading, error and empty states

`must` `mobile`

**Description**
The app must never crash or show a blank screen, whatever happens with the network or the data. Children won't understand an error message, so the states should be friendly.

**Scope**

- Loading: a simple indicator while data is fetched.
- Error (no network, server down): a friendly message and a "Försök igen" button.
- Empty: no story today, an empty archive, a story that no longer exists.

**Technical notes**

- The three-state pattern from today.tsx (`undefined` / `null` / data) can be extended with an error state.
- Test with flight mode on the phone, and with a wrong API URL.

**Acceptance criteria**

- [ ] Every screen handles loading, error and empty without crashing.
- [ ] "Försök igen" fetches the data again.
- [ ] All texts are in Swedish and suitable for children.

---

### 23. Vercel Cron for the daily rotation

`must` `backend`

**Description**
A scheduled job that publishes the day's story automatically, so I don't have to do anything each morning.

**Scope**

- A protected endpoint that changes today's approved story from `scheduled` to `published`.
- A Vercel Cron job that calls it once a day.

**Technical notes**

- Vercel Cron runs in UTC. Midnight in Sweden is 22:00 or 23:00 UTC depending on daylight saving time, so pick a time that works all year (for example a little after 23:00 UTC).
- Protect the endpoint with a secret (`CRON_SECRET`) so nobody else can call it.
- The app must still work if the cron job runs late (see the decision in issue 17).
- Never generate stories in the cron job (see ambiguity.md).

**Acceptance criteria**

- [ ] The cron job runs on the deployed backend and publishes the day's story.
- [ ] Calling the endpoint without the secret gives 401.
- [ ] The app shows the right story even if the cron job hasn't run yet.

---

### 24. Manual device checklist

`must` `docs`

**Description**
A short checklist I run on a real phone before each sprint ends, since the app has no automated UI tests.

**Scope**

- The checks from the phone test (navigation, scrolling, fonts, background, bottom nav, dark mode), plus real data, no network and an empty state.

**Acceptance criteria**

- [ ] The checklist is in the repo (for example `docs/device-checklist.md`).
- [ ] It has been run against the deployed backend, and the result is noted.

---

### 25. Must checkpoint

`must`

**Description**
A stop at the end of sprint 3 to check that the MVP works end to end, before any Should work starts.

**Acceptance criteria**

- [ ] All Must items work on a real phone against the deployed backend.
- [ ] Open bugs are listed and prioritised.
- [ ] The remaining time is planned: which Should items fit.

---

## Sprint 4: Admin page, light/dark mode, animations

### 26. Create the `web/` project (React + Vite + TS)

`should` `web`

**Description**
The web project for the admin page, as its own Vercel project.

**Scope**

- A React + Vite + TypeScript project in `web/`, running locally.
- Deployed to Vercel with `web/` as root directory.
- The backend URL from configuration.

**Acceptance criteria**

- [ ] Runs locally and on its own Vercel URL.
- [ ] README explains how to run it.

---

### 27. Admin login and protected endpoints

`should` `backend` `web`

**Description**
Only I may create, edit and publish stories, so all admin endpoints require login.

**Scope**

- Login with email and password, returning a signed JWT (with `JWT_SECRET`).
- Middleware that checks the token on all admin endpoints.
- An admin role, so a regular member can never reach admin endpoints (relevant once membership exists).

**Technical notes**

- Passwords hashed with bcrypt or argon2, never stored in plain text.
- The admin account is created with a script or directly in the database, not through public registration.

**Acceptance criteria**

- [ ] Admin endpoints return 401 without a valid token.
- [ ] Login works from the admin page.
- [ ] Tests cover a missing token, an invalid token and a valid token.

---

### 28. Admin: list, create, edit and schedule stories

`should` `web`

**Description**
Read, edit and schedule stories on a big screen, instead of in the Supabase table view.

**Scope**

- A list of all stories with status, date and source, filterable by status.
- An edit view for title, text and date.
- Creating a handwritten story (`source: handwritten`).

**Acceptance criteria**

- [ ] Stories can be listed, edited and given a date.
- [ ] Handwritten stories can be created and are marked as handwritten.
- [ ] Input is validated in the backend, not only in the form.

---

### 29. Admin: publish and unpublish

`should` `web`

**Description**
Change the status of a story directly in the admin page.

**Acceptance criteria**

- [ ] Draft → scheduled, and back again, works from the admin page.
- [ ] A published story can be unpublished.
- [ ] The Supabase table view is no longer needed for the daily routine, and the routine in issue 16 is updated.

---

### 30. Light/dark mode

`should` `mobile`

**Description**
A toggle between "Dagsläge" and "Nattläge", with the system setting as default.

**Scope**

- A ThemeProvider with a toggle in the app.
- Both themes checked on all screens.

**Technical notes**

- Much of this is already in place: `lightTheme`/`darkTheme` and the background images exist.

**Acceptance criteria**

- [ ] The toggle works and the choice is remembered when the app restarts.
- [ ] All screens look right in both themes, including text contrast.

---

### 31. Animations with Reanimated

`should` `mobile`

**Description**
A few meaningful animations that make the app feel magical, without slowing it down.

**Scope**

- For example: a soft transition when a story opens, the star when favouriting (sprint 5), and the cover animation (issue 45).

**Technical notes**

- All animations respect "reduce motion" (`useReducedMotion`).

**Acceptance criteria**

- [ ] At least two animations are in place.
- [ ] They run smoothly on a real phone.
- [ ] No animation runs when "reduce motion" is on.

---

## Sprint 5: Membership, favorites, polish

### 32. Registration and login (JWT)

`should` `backend` `mobile`

**Description**
Members can create an account and log in, which is needed for favorites.

**Scope**

- Registration and login in the app, using the same JWT setup as the admin page.
- The token stored securely in the app.

**Technical notes**

- Use `expo-secure-store` for the token, not plain storage.
- Validate email and password length in the backend.

**Acceptance criteria**

- [ ] Passwords are hashed, and input is validated.
- [ ] The token survives an app restart and can be logged out.
- [ ] A member cannot reach admin endpoints.

---

### 33. Favorites (star a story)

`should` `backend` `mobile`

**Description**
Logged-in members can star stories and find them again in their own list.

**Scope**

- A `Favorite` model linking a user and a story.
- A star in the reading view, and a list of favorites.

**Acceptance criteria**

- [ ] Favorites are saved per user and shown in a list.
- [ ] Only logged-in users can star stories.
- [ ] One user can never see or change another user's favorites.

---

### 34. Illustrations

`should` `mobile`

**Description**
Each story can have its own illustration, shown on the cover.

**Scope**

- Show the image from `imageUrl` when it exists, and the default image otherwise.

**Acceptance criteria**

- [ ] Stories with and without images both look right.
- [ ] The image source and license are noted for every image used.

---

### 35. Image credits in the app

`should` `mobile` `docs`

**Description**
A note in the app about where the images come from. Its content depends on the open decision about background images in ambiguity.md (Adobe Stock, or ChatGPT/Pixnio).

**Acceptance criteria**

- [ ] The note is visible in the app and matches the images actually used.
- [ ] The license check is done before any public release.

---

### 36. Testing and bug fixing

`must` `bug`

**Description**
Time set aside to fix what has come up, and to check that the tests cover the core.

**Acceptance criteria**

- [ ] Core endpoints and the scheduling logic are tested, and `npm test` passes.
- [ ] The device checklist (issue 24) passes.
- [ ] Known bugs are fixed or listed in the README as known issues.

---

### 37. Content check of published stories

`must` `ai`

**Description**
A last read-through of every published story before submission.

**Acceptance criteria**

- [ ] Every published story has been read and approved by me.
- [ ] Anything unsuitable is unpublished or fixed.

---

### 38. README and AI log

`must` `docs`

**Description**
The README must let someone else run the whole project, and the AI log must be complete for the report.

**Acceptance criteria**

- [ ] The README covers mobile, backend, web, environment variables, deploy and tests.
- [ ] Someone else (or I, on a clean clone) can follow the README from start to finish.
- [ ] `ai-log.md` is up to date, including costs.

---

### 39. Demo preparation

`must` `docs`

**Description**
A short, rehearsed demo that shows the MVP and the most important choices.

**Acceptance criteria**

- [ ] A short demo script exists.
- [ ] A short screen recording exists as a backup in case the live demo fails.

---

## Backlog (Could)

### 40. Public web version

`could` `web`

**Description**
Story of the day and the archive as public pages in the `web/` project, for people without the app.

**Acceptance criteria**

- [ ] Story of the day and the archive work in the browser and use the same API.
- [ ] The admin page keeps working independently.

---

### 41. Categories/themes and filtering in the archive

`could` `mobile` `backend`

**Description**
Filter the archive by theme (for example friendship, courage, nature).

**Acceptance criteria**

- [ ] Stories have a theme, and the archive can be filtered by it.

---

### 42. Share the story of the day via a link

`could` `mobile`

**Description**
Share a link to a story, for example to a grandparent.

**Technical notes**

- Needs a web page the link can open, so it depends on issue 40.

**Acceptance criteria**

- [ ] Sharing opens the phone's share sheet with a working link.

---

## New issues (book-like reading view, Sprint 4)

### 43. Reading view: cover page with title, illustration and author

`should` `mobile` · Sprint 4

**Description**
Every story starts with a cover page before the text, like a picture book. The cover shows the title, an illustration and who wrote the story. This makes each story feel like a small book of its own, and it shows openly whether a story was written by AI or by me.

**Scope**

- Cover page with the title, an illustration and a byline.
- Byline based on the `source` field: `ai` → "Skriven av Sagolandets AI", `handwritten` → "Skriven av Patricia". Exact wording can be changed later.
- If `imageUrl` is missing, a default illustration is shown, so every cover looks finished.
- Used in both the story of the day and the reading view from the archive.

**Out of scope**

- Page turning (issue 44). Until that is done, the cover is shown above the scrolling text.
- Animation on the cover (issue 45).
- Creating the illustrations themselves.

**Technical notes**

- The `Story` type in `mobile/src/api/stories.ts` needs `source` and `imageUrl?` to match the database model.
- Build the cover as its own component (for example `components/story-cover.tsx`) so both screens can use it.
- Title size with `rem()` and the width cap, like the site title.

**Acceptance criteria**

- [ ] The cover shows the title, an illustration and the correct byline for both `ai` and `handwritten`.
- [ ] A story without `imageUrl` shows the default illustration.
- [ ] The cover looks good on phone, tablet and web, in both light and dark mode.
- [ ] The same component is used for the story of the day and the archive.

---

### 44. Reading view: page turning with swipe and arrows

`should` `mobile` · Sprint 4 · Depends on: 43

**Description**
Stories are read one page at a time instead of by scrolling, like an e-book. A page with a limited amount of text feels less overwhelming for young readers, and turning pages makes reading more like a real book. The first page is the cover.

**Scope**

- Swipe left and right between pages on phone and tablet.
- Back and forward arrows on all platforms. They are the main way to turn pages on the web, where swiping with a mouse works poorly.
- A page indicator, for example "Sida 2 av 5" or dots.
- The text is split into pages at paragraph breaks (blank lines). Each page holds roughly a fixed amount of text, adjusted for screen size.
- If a page is still too long for the screen (large system font, small phone), that page can scroll a little, so no text is ever cut off.

**Out of scope**

- Measuring the exact amount of text that fits on each screen. Splitting at paragraphs is enough.
- Remembering which page you were on when you come back.
- Page-turn animations beyond the built-in swipe.

**Technical notes**

- `FlatList` with `horizontal` and `pagingEnabled` gives swipeable pages without a new dependency.
- Reuse the paragraph splitting from `StoryText`. The page splitting can be a small pure function (`splitIntoPages(body, maxChars)`), which is easy to unit test.
- Arrows: hide "back" on the cover and "forward" on the last page.
- Each page needs an accessible label so screen readers can follow along.

**Acceptance criteria**

- [ ] Swiping changes page on phone and tablet (tested in Expo Go).
- [ ] The arrows change page on all platforms, and are hidden at the start and end.
- [ ] The page indicator shows the current page and the total.
- [ ] No paragraph is split across two pages, and no text is cut off.
- [ ] Works for both the story of the day and the archive.
- [ ] `splitIntoPages` has unit tests for a short story, a long story and a single very long paragraph.

---

### 45. Cover animation: title letters and floating illustration

`should` `mobile` · Sprint 4 · Depends on: 43 · Related: 31

**Description**
When a story opens, the cover comes to life: the title's letters fly into place one by one, and the illustration floats gently up and down. It gives a magical start to each story and fits the fairy-tale feel of the app.

**Scope**

- The title letters animate in one after another with a short delay, then stay still.
- The illustration moves slowly and softly up and down, repeating while the cover is visible.
- The animations respect the device's "reduce motion" setting. When it is on, the cover is shown without movement.

**Out of scope**

- Animations on other pages or in the archive (part of issue 31).
- Sound effects.

**Technical notes**

- Use Reanimated, which is included in the Expo template. Check `package.json` before adding anything.
- Letters: split the title into characters and give each one an entering animation with an increasing delay. Keep spaces, so words don't run together.
- Floating: a repeating animation on `translateY` (a few pixels up and down, a few seconds per cycle).
- `useReducedMotion()` from Reanimated tells you whether reduced motion is turned on.
- The whole title must still be readable as one text for screen readers, even though each letter is its own element.

**Acceptance criteria**

- [ ] The title letters fly into place when the cover is opened, and then stay still.
- [ ] The illustration floats gently and does not distract from the title.
- [ ] With "reduce motion" turned on, there is no animation.
- [ ] The animation runs smoothly in Expo Go on a real phone, not just in the browser.
- [ ] A screen reader reads the title as one word or phrase, not letter by letter.

### 46. Rotating background images

`could` `mobile`

**Description**
A different background image each day, in a fixed order, so the app feels new every day like the story does.

**Scope**

- 2–3 backgrounds to start with, each in three shapes (portrait, landscape, wide) and two themes (6 files per background).
- Today's date (Europe/Stockholm) picks the background, so it is the same all day on every screen.

**Out of scope**

- Animated cross-fades between images.

**Acceptance criteria**

- [ ] The background changes from one day to the next and stays the same during the day.
- [ ] Text is easy to read on every background, in both themes.
- [ ] The images are compressed, and the app is not noticeably slower to load.
- [ ] Decide first whether this is still wanted once stories have their own cover illustrations (issues 34 and 43).

### 47. Short story summary for the archive

`should` `ai` `backend` `mobile` · Sprint 4 (or right after the Must checkpoint, issue 25)

**Description**
Each story gets a short summary of one sentence, like the blurb on the back of a book, for example "En liten snigel som är långsammast i hela trädgården upptäcker något som ingen annan har." It is shown in the archive instead of only the date, which makes the list more inviting to browse. It can also be used on the cover page (issue 43) and when sharing a story (issue 42).

**Scope**

- A new optional field `summary` (`String?`) on the Story model, added with a Prisma migration.
- The prompt asks for one more line in the answer: `Beskrivning:` followed by one sentence of at most 20 words, placed before the `Figurer:` line. It must not reveal the ending.
- The parser reads the `Beskrivning:` line. If it is missing, `summary` is `null` instead of the parse failing.
- The batch script saves `summary`.
- `GET /stories` includes `summary` in each list item.
- The app shows the summary in the archive list. Stories without one show the date, as now.
- The review checklist in `docs/review-routine.md` gets a line for checking the summary.

**Out of scope**

- Writing summaries for existing stories. Do that by hand in Supabase where wanted.
- Showing the summary on the cover page (part of issue 43).

**Technical notes**

- The new migration must not affect existing rows: the field is optional, so old stories simply get `null`.
- Follow the same pattern as the `Figurer:` line in `parse-story-response.ts`, including tolerating `**` around the label.
- Keep the order in the prompt's format rule clear: title, blank line, story, blank line, `Beskrivning:`, `Figurer:`. Test once with `--count 1` that the model follows it and that the summary line doesn't end up in the story body.
- Update the tests: parser (with and without the summary line), and the list endpoint's `select`.

**Acceptance criteria**

- [ ] New AI stories are saved with a summary, and the story body does not contain the summary line.
- [ ] A response without a `Beskrivning:` line still parses, with `summary: null`.
- [ ] The archive shows the summary where there is one, and the date otherwise.
- [ ] Existing stories are unaffected by the migration.
- [ ] Tests for the parser and the list endpoint are updated, and `npm test` passes.
- [ ] The review checklist includes the summary.
