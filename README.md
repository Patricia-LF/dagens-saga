# Dagens saga

A mobile app for children that delivers a new, AI-generated fairy tale every day, with an archive of older stories. Thesis project (5 weeks, solo). Stories are generated with AI but the system is built so I can swap in my own stories later.

## Stack

- App: React Native (Expo, Expo Go), TypeScript, Expo Router for navigation
- Backend: Node.js + Express, TypeScript, hosted on Vercel (Vercel Cron for the daily rotation)
- Database: Supabase (PostgreSQL) accessed through Prisma
- AI: text generation via API (provider not decided, see ambiguity.md)

## Repo layout

One repo, separate folders, each with its own `package.json`:

- `mobile/` — the Expo app
- `backend/` — Express API, Prisma schema and migrations
- `web/` — web project (React + Vite): the admin page under `/admin` (Should), and maybe the public web version later (Could)
- Project documents (`CLAUDE.md`, `scope.md`, `constraints.md`, `ambiguity.md`, `ai-log.md`) live in the repo root.

## License

Copyright (c) 2026 Patricia Frykberg. All rights reserved.

The source code is provided for viewing only. See the `LICENSE` file for details.

The images and stories are not covered by any license and may not be copied, used, or redistributed. The images are licensed to me via Adobe Stock and are not included in this repository.
