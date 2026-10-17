# Dagens saga

A mobile app for children that delivers a new, AI-generated fairy tale every day, with an archive of older stories. Thesis project (5 weeks, solo). Stories are generated with AI but the system is built so I can swap in my own stories later.

## Read before starting any task

- @scope.md — what to build and in what priority (MoSCoW)
- @constraints.md — rules that must not be broken
- @ambiguity.md — open decisions. Do NOT decide these yourself; ask me.

## Stack

- App: React Native (Expo, Expo Go), TypeScript, Expo Router for navigation
- Backend: Node.js + Express, TypeScript, hosted on Vercel (Vercel Cron for the daily rotation)
- Database: Supabase (PostgreSQL) accessed through Prisma
- AI: text generation via the OpenAI API (see ambiguity.md)

## Repo layout

One repo, separate folders, each with its own `package.json`:

- `mobile/` — the Expo app
- `backend/` — Express API, Prisma schema and migrations
- `web/` — web project (React + Vite): the admin page under `/admin` (Should), and maybe the public web version later (Could)
- Project documents (`CLAUDE.md`, `scope.md`, `constraints.md`, `ambiguity.md`, `ai-log.md`) live in the repo root.

## How to work

- Plan first. For anything larger than a small change, propose a short plan and wait for my OK before writing code.
- Work in small steps. One feature or fix per task, and keep each change easy to review.
- If something is unclear or not covered by the files above, ask instead of guessing.
- Do not add dependencies without asking me first.
- Explain new concepts briefly (React Native, Prisma, Supabase are new to me), but do not over-explain things I already know (React, Node/Express, TypeScript).
- I need to understand and be able to explain all code. Prefer simple, readable solutions over clever ones.
- Never commit secrets. Use environment variables and keep `.env` out of git.

## Code conventions

- All code, file names, variable and function names, commit messages, and code comments are in English.
- TypeScript in strict mode. No `any` without a comment explaining why.
- Keep the user-facing app text in Swedish.

## Documentation

- I keep an AI log (`ai-log.md`) for the course. After a meaningful task, suggest a one or two line entry (what AI was used for, what I had to change or fix manually). Do not write it unless I say so.

## Commands

- Run the app (in `mobile/`): `npx expo start`. Press `w` for the browser preview, or scan the QR code with Expo Go on a real device.
- Backend (in `backend/`): install with `npm install`. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (transaction pooler, port 6543) and `DIRECT_URL` (session pooler, port 5432).
- Prisma (in `backend/`): `npm run db:migrate -- --name <name>` (create and apply a migration), `npm run db:generate` (regenerate the client in `src/generated/`, which is not in git), `npm run db:studio` (browse the data).
- Run the backend (in `backend/`): `npm run dev` starts the server with auto-reload on http://localhost:3000 (set `PORT` to change). `npm run build` compiles to `dist/`, then `npm start` runs the compiled build. Check it with `curl http://localhost:3000/health`.
- Tests (in `backend/`): `npm test` runs all tests once (Vitest + Supertest, test files in `backend/tests/`, named `*.test.ts`). `npm run test:watch` re-runs them when files change. Tests are outside `src/`, so `npm run build` ignores them.
