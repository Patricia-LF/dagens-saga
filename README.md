# Dagens saga

A mobile app for children that delivers a new, AI-generated fairy tale every day, with an archive of older stories. Thesis project (5 weeks, solo). Stories are generated with AI but the system is built so I can swap in my own stories later.

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

## Getting started

### Requirements

- Node.js (LTS)
- A Supabase project (free tier is enough)
- Expo Go on your phone, or use the browser preview

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

### Set up the database (Supabase)

1. Create a free account at [supabase.com](https://supabase.com) and click **New project**.
2. Choose a region close to you (for example **Stockholm** or **Frankfurt**). Use the same region for the backend on Vercel later, so the database calls stay fast.
3. Set a **database password** with **only letters and digits** (20+ characters). Special characters such as `@ # / ? :` break the connection URL. Save the password in a password manager, since Supabase will not show it again.
4. Wait until the project is ready (a minute or two).
5. Recommended: turn off the Data API under **Project Settings → API**. All database access goes through the Express backend, so the public Supabase API is not needed.

### Find `DATABASE_URL` and `DIRECT_URL`

Last checked: October 2026

Both values come from the **Connect** button at the top of the Supabase project dashboard.

1. Click **Connect**.
2. Under **Connection String**, open the **Method** dropdown. There are three options, and you need two of them:

   | Method in Supabase     | Port | Use in `.env`  | Used for                                                          |
   | ---------------------- | ---- | -------------- | ----------------------------------------------------------------- |
   | **Transaction pooler** | 6543 | `DATABASE_URL` | The running backend (many short serverless calls)                 |
   | **Session pooler**     | 5432 | `DIRECT_URL`   | Prisma migrations only                                            |
   | Direct connection      | 5432 | _do not use_   | IPv6 only, usually unreachable from home networks, WSL and Vercel |

3. Copy the **Transaction pooler** string into `DATABASE_URL`, and the **Session pooler** string into `DIRECT_URL`.
4. In both strings, replace `[YOUR-PASSWORD]` with your database password (without the brackets).

The two strings are identical except for the port. They should look like this:

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
```

Check that:

- the host ends with **`pooler.supabase.com`** (not `db.<project-ref>.supabase.co`)
- the user name is **`postgres.<project-ref>`**, with your project ref after the dot
- there is no `?pgbouncer=true` at the end (not needed with the Prisma pg adapter)

### Troubleshooting

| Error from `npm run db:migrate`      | Likely cause                                                     | Fix                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `P1001: Can't reach database server` | `DIRECT_URL` uses the direct connection (`db.<ref>.supabase.co`) | Use the **Session pooler** string instead                                                             |
| `P1000: Authentication failed`       | Wrong password, or the password contains special characters      | Reset the password (**Project Settings → Database**) to letters and digits only, and update both URLs |

### Generate JWT_SECRET

`JWT_SECRET` in `backend/.env` is a long random string used to sign login tokens. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Create the database tables

```bash
npm run db:migrate
```

Never commit `.env`. Only `.env.example`, with placeholder values, belongs in the repository.

### Mobile app

```bash
cd mobile
npm install
npx expo start
```

Press `w` to open the app in the browser, or scan the QR code with Expo Go.

### Images

The background images are licensed via Adobe Stock and are not included in the repository. Place them in `mobile/assets/images/backgrounds/` with the file names used in `mobile/src/constants/theme.ts`.

### Platform notes

The commands above work the same on macOS, Linux, Windows with WSL, and Windows PowerShell. The few differences:

|                       | macOS / Linux                                                          | Windows (WSL)                                                                                                 | Windows (PowerShell / CMD)                                                          |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Copy `.env.example`   | `cp .env.example .env`                                                 | `cp .env.example .env`                                                                                        | PowerShell: `cp .env.example .env`, CMD: `copy .env.example .env`                   |
| Expo Go on your phone | Usually works directly if the phone and computer are on the same Wi-Fi | Often blocked by WSL's separate network. Use `npx expo start --tunnel`, or turn on mirrored networking in WSL | Usually works directly on the same Wi-Fi (allow Node through the firewall if asked) |

Simulators are optional. The Android Emulator works on all platforms (requires Android Studio). The iOS Simulator works only on macOS (requires Xcode from the App Store).

You can also copy `.env.example` by duplicating the file in your editor and renaming it to `.env`.

This project was developed and tested on **Windows 11 with WSL (Ubuntu)**. Other platforms follow the same steps but have not been tested. If something does not work on your system, please open an issue.

## License

Copyright (c) 2026 Patricia Frykberg. All rights reserved.

The source code is provided for viewing only. See the `LICENSE` file for details.

The images and stories are not covered by any license and may not be copied, used, or redistributed. The images are licensed to me via Adobe Stock and are not included in this repository.
