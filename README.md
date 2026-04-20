# Dash Spectacle

Family / home dashboard built with **Next.js** (App Router) and **Convex** (database + server functions). It includes authentication, a wall-style dashboard, gallery uploads, messages, prayer requests, and optional weather and Google Calendar data.

## Features

- **Authentication** — [Convex Auth](https://labs.convex.dev/auth) with password sign-in/sign-up plus GitHub and Google OAuth (`convex/auth.ts`).
- **Dashboard** — Main always-on style view at `/dashboard` (weather widgets, messages, prayer requests, calendar, background slideshow).
- **Routes** — `/gallery`, `/messages`, `/prayer-requests`, `/profile`, `/users`, and `/signin`.

## Tech stack

| Layer        | Choice                                                |
| ------------ | ----------------------------------------------------- |
| App          | Next.js 16, React 19, TypeScript                      |
| Styling      | Tailwind CSS v4, Radix UI, Lucide                     |
| Backend      | Convex (queries, mutations, actions, HTTP router)     |
| Auth         | `@convex-dev/auth`                                    |
| Image upload | Vercel Blob (`/api/upload`) + Convex `images` records |

## Prerequisites

- **Node.js** (current LTS recommended)
- **pnpm** (this repo uses pnpm; do not assume `npm`/`yarn` lockfiles)
- A **Convex** account and project ([convex.dev](https://www.convex.dev))

## Getting started

1. **Install dependencies** (from the repository root):

   ```bash
   pnpm install
   ```

2. **Link Convex and push functions** — run from the **project root** (not inside `convex/` alone), so the CLI resolves correctly:

   ```bash
   pnpm exec convex dev
   ```

   On first run, the CLI will guide you to create or select a deployment. Leave this process running while developing so functions and schema stay synced.

3. **Configure environment variables** (see below). After `convex dev`, Convex can print or sync values such as `NEXT_PUBLIC_CONVEX_URL` into `.env.local` depending on your flow.

4. **Start the Next.js dev server** (second terminal, project root):

   ```bash
   pnpm dev
   ```

   The app listens on **[http://localhost:3001](http://localhost:3001)** (`next dev -p 3001` in `package.json`).

5. Open the app, sign in or sign up at `/signin`, and use `/dashboard` when authenticated.

## Environment variables

### Next.js (`.env.local`)

| Variable                 | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL for the browser client (required). |

**Vercel Blob** (gallery uploads via `src/app/api/upload/route.ts`):

| Variable                | Purpose                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `BLOB_READ_WRITE_TOKEN` | Server token for `@vercel/blob` upload handling ([Vercel Blob docs](https://vercel.com/docs/storage/vercel-blob)). |

Set these locally and in your hosting provider (e.g. Vercel) for production.

### Convex (dashboard or `pnpm exec convex env set …`)

These are read inside Convex functions (`process.env` in `convex/`). Configure them in the Convex dashboard **Environment Variables** for your deployment, or via the CLI.

| Variable                             | Used by                 | Purpose                                                                                                                                                                           |
| ------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONVEX_SITE_URL`                    | `convex/auth.config.ts` | Site origin for auth (e.g. `http://localhost:3001` in dev, your production URL in prod).                                                                                          |
| `AUTH_SECRET`                        | Convex Auth             | Secret for signing sessions (generate a strong random string).                                                                                                                    |
| OAuth secrets                        | `convex/auth.ts`        | GitHub / Google client ID and secret env names follow [Convex Auth](https://labs.convex.dev/auth/config/oauth) / Auth.js provider conventions—set whichever providers you enable. |
| `WEATHER_API_KEY`                    | `convex/weather.ts`     | External weather API (optional; widget degrades without it).                                                                                                                      |
| `WEATHER_ZIP_CODE`                   | `convex/weather.ts`     | Optional ZIP for forecast defaults.                                                                                                                                               |
| `HOMEASSISTANT_URL`                  | `convex/weather.ts`     | Optional Home Assistant integration.                                                                                                                                              |
| `HOMEASSISTANT_TOKEN`                | `convex/weather.ts`     | Optional HA token.                                                                                                                                                                |
| `HOMEASSISTANT_LOCAL_TEMPERATURE_ID` | `convex/weather.ts`     | Optional HA entity id.                                                                                                                                                            |
| `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` | `convex/calendar.ts`    | JSON string of a Google service account (calendar read).                                                                                                                          |
| `GOOGLE_CALENDAR_ID`                 | `convex/calendar.ts`    | Calendar id to read events from.                                                                                                                                                  |

Example (Convex CLI, from project root):

```bash
pnpm exec convex env set WEATHER_API_KEY "your-key"
```

## Convex data model

Defined in `convex/schema.ts`:

- **Auth tables** — Spread from `authTables` (`@convex-dev/auth/server`) for sessions and identities.
- **`users`** — Profile fields, `role`, upload limits, indexed by `email`.
- **`images`** — User-linked gallery items (`userId`, `url`, storage metadata, `uploadedAt`).
- **`messages`** — Family message feed (`userId`, `name`, `content`).
- **`prayerRequests`** — Prayer metadata and `isAnswered` / `answeredAt`, indexed by `isAnswered`.
- **`settings`** — Key-value app settings, indexed by `key`.
- **`weather`** — Cached current/forecast payloads, indexed by `type`.

HTTP routes for auth are registered in `convex/http.ts` via `auth.addHttpRoutes`.

## Useful scripts

| Command                       | Description                             |
| ----------------------------- | --------------------------------------- |
| `pnpm dev`                    | Next.js dev server on port **3001**     |
| `pnpm build`                  | Production build                        |
| `pnpm start`                  | Start production server (after `build`) |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                  |
| `pnpm prettier`               | Format `src/**/*.{js,jsx,ts,tsx}`       |

## Repository layout

- `convex/` — Schema, auth, and backend modules (`users`, `messages`, `images`, `prayerRequests`, `settings`, `weather`, `calendar`, `profile`, `http`, etc.).
- `src/app/` — App Router pages and `api/upload` route.
- `src/components/` — UI and dashboard widgets.
- `src/providers/` — `ConvexClientProvider` (Convex + Convex Auth client wiring).

For a deeper architecture outline (auth flow, adding features), see `AI_README.md`.

## Convex Auth and Next.js

This app uses **Convex Auth’s Next.js integration** (`ConvexAuthNextjsServerProvider` in `src/app/layout.tsx`, client provider in `src/providers/ConvexClientProvider.tsx`). Follow the official setup so server actions and cookie flows work end-to-end: [Convex Auth — Next.js](https://labs.convex.dev/auth/setup/nextjs).

If sign-in fails with **`POST /api/action` 404**, the Next.js side of Convex Auth is usually not wired (for example missing or misnamed **`src/middleware.ts`** that exports `convexAuthNextjsMiddleware` from `@convex-dev/auth/nextjs/server`). Align your tree with the current Convex Auth Next.js guide.

## Deploying

- **Convex** — Deploy functions with `pnpm exec convex deploy` when you are ready for a production deployment; mirror environment variables on the production Convex deployment.
- **Next.js** — Deploy to Vercel or any Node host; set `NEXT_PUBLIC_CONVEX_URL`, `BLOB_READ_WRITE_TOKEN`, and any other `.env.local` variables your build requires.

## Learn more

- [Convex documentation](https://docs.convex.dev)
- [Convex Auth](https://labs.convex.dev/auth)
- [Next.js documentation](https://nextjs.org/docs)
