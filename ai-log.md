# AI log — Dagens saga

Running notes on AI use during the project, sorted by the four categories that must be documented in the final report. Add a few lines whenever something worth mentioning happens. A date and a short description is enough; it will be written out as full text later.

## Planning, research

_E.g. research on tech choices, architecture discussions, project planning with AI._

- Before project start: brainstormed the project idea, tech stack and scope with Claude. The examiner's feedback was that the stack had too little that was new to me, so I switched to React Native with Expo. Claude helped me compare options, but I made the decisions myself.
- Before project start: Claude helped me write the project plan in English, including the MoSCoW list, sprint plan and risk table. I corrected, among other things, that GSAP does not work in React Native (Reanimated is used instead) and that the project is five weeks, not six.
- Before project start: went through the Adobe Stock license terms for the images with Claude, and decided to keep licensed images out of git. I will contact Adobe about the terms myself and check them again before any public release.
- 2026-10-12: Claude drafted issues per sprint (`issues.md`) from the sprint plan. I adjust them myself and create the milestones and dates in GitHub.
- 2026-10-12: discussed names for the app with Claude. I tested the suggestions on children aged 6-10, which showed that the name matters more to parents than to the children. No final choice yet.
- 2026-10-12: discussed the license with Claude. I chose "All rights reserved" for the code, and decided that images and stories are not covered by any license. I wrote the README text myself, based on a suggestion.

## Daily use, agent mode

_E.g. Claude Code use while coding: scaffolding, debugging, rubber-ducking, which skills were used for what._

- Before project start: Claude helped me write `CLAUDE.md`, `scope.md`, `constraints.md` and `ambiguity.md` as guidance files for Claude Code.
- 2026-10-12: created the repo and set up the project myself (Expo app in `mobile/`). Claude Code has not been used for the setup yet.
- 2026-10-13: Used Claude Code to set up Prisma 7 with Supabase (Opus for planning, Sonnet for implementation). I reviewed the plan and added the characters field before approving. At my request it verified that ?pgbouncer=true is not needed with the pg adapter. The first migration failed twice: DIRECT_URL used the IPv6-only direct host instead of the session pooler, and the password had special characters that broke the URL. Claude Code diagnosed both without reading the password; I updated .env and reset the password myself. Verified with a test row through the pooled connection.
  Cost: $1.03 (Opus planning $0.51, Sonnet implementation and debugging $0.50)
- 2026-10-17: Used Claude Code to set up Express + TypeScript (issue 7) with an app/server split and a /health endpoint. Reviewed the plan before implementation and asked it to verify both `npm run dev` and `npm run build && npm start`. Tested /health myself in the browser. No manual code fixes needed. Cost: $0.34 (Opus planning $0.17, Sonnet implementation $0.17).
- 2026-10-17: Used Claude Code to set up Vitest + Supertest (issue 12) and write the first /health test. Chose to keep tests in backend/tests/ so the build is unaffected. Verified that the test fails when the endpoint changes. npm install reported 4 high-severity vulnerabilities; npm audit showed they come from the Prisma CLI (deepmerge-ts and mysql2), not from the new test packages, and only affect local CLI use. Cost: $0.27 (Opus planning $0.14, Sonnet implementation $0.13).

## Code control, validation, reviews, security

_E.g. how AI suggestions were reviewed before going into the code, security reviews, what was changed manually afterwards._

- 2026-10-12: removed the MIT `LICENSE` from the Expo template in `mobile/`, so that only the license in the repo root applies.
- 2026-10-12: installing `@expo/ngrok` produced 30 vulnerability warnings (mostly older dependencies in a development tool). I did not run `npm audit fix --force`, because it can break the project. To be reviewed again before submission.
- 2026-10-17: Updated prisma, @prisma/client and @prisma/adapter-pg together to 7.10.1 instead of running npm audit fix, which would only have updated the CLI.

## Other necessary or interesting information

_E.g. token limits hit, AI going wrong, unexpected situations and how they were solved._

- 2026-10-12: connecting a phone through `expo start --tunnel` in WSL did not work. The global install of `@expo/ngrok` failed because of permissions, and after a local install ngrok returned an empty response. Claude suggested WSL "mirrored networking" as an alternative. I am postponing the phone test and continuing with the web preview (`w`) for now.
- 2026-10-12: React Native DevTools reported a missing `libnspr4.so`. Claude explained that it is not critical, and I have not fixed it.
- 2026-10-17: Deployed the backend to Vercel (issue 8). The build failed three times before it worked: the generated Prisma client is not in git (fixed by running `prisma generate` in the build script), `prisma generate` requires `DIRECT_URL` (added it as an environment variable in Vercel, since it uses the same credentials as `DATABASE_URL`), and Vercel's TypeScript step could not find `@types/node` (fixed by setting `typeRoots` in tsconfig.json). Skipped Vercel's suggested Prisma Postgres integration, since the project already uses Supabase.
- 2026-10-18: Got the app running on a real phone via Expo Go (issue 2) by turning on WSL mirrored networking and adding a Hyper-V firewall rule for port 8081. The earlier tunnel attempt (ngrok) was dropped, and @expo/ngrok was uninstalled.
