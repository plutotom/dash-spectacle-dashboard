# Agent guide — Dash Spectacle

Family/home dashboard: **Next.js 16** (App Router) + **Convex** + **Convex Auth**.

## Commands

Run from the repository root:

```bash
pnpm install
pnpm dev              # Next.js on http://localhost:3001
pnpm exec convex dev  # Convex backend (separate terminal)
pnpm lint
pnpm format
pnpm format:check
pnpm typecheck
pnpm build
```

## Stack

| Layer   | Choice                                        |
| ------- | --------------------------------------------- |
| App     | Next.js 16, React 19, TypeScript              |
| Backend | Convex (`convex/`)                            |
| Auth    | `@convex-dev/auth` (password, GitHub, Google) |
| Styling | Tailwind CSS v4, Radix UI                     |
| Uploads | Vercel Blob + Convex `images` table           |

## Local setup

1. `pnpm install`
2. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_CONVEX_URL` (printed by Convex CLI).
3. `pnpm exec convex dev` — link/create a deployment; keep running while developing.
4. Set Convex env vars (see `.env.example` comments), at minimum:
   - `CONVEX_SITE_URL=http://localhost:3001`
   - `AUTH_SECRET` (random string)
5. `pnpm dev` — open http://localhost:3001

## Auth wiring

- Providers: `convex/auth.ts`
- JWT config: `convex/auth.config.ts` (`CONVEX_SITE_URL`)
- Next.js integration: `ConvexAuthNextjsServerProvider` in `src/app/layout.tsx`
- Request proxy: `src/proxy.ts` exports `convexAuthNextjsMiddleware()` (Next.js 16 renamed `middleware.ts` → `proxy.ts`)

If sign-in fails with `POST /api/action` 404, confirm `src/proxy.ts` exists and matches the [Convex Auth Next.js guide](https://labs.convex.dev/auth/setup/nextjs).

## Project layout

- `convex/` — schema, auth, queries/mutations/actions
- `src/app/` — routes (`/dashboard`, `/signin`, `/gallery`, …)
- `src/components/` — UI and dashboard widgets
- `src/providers/ConvexClientProvider.tsx` — client Convex + auth provider

## Conventions

- **Package manager:** pnpm only (`packageManager` field in `package.json`).
- **Node:** see `.node-version` / `engines.node`.
- **Lint:** ESLint 9 flat config; `@convex-dev/eslint-plugin` applies to `convex/**/*.ts`.
- **Format:** Prettier 3; `convex/_generated` is ignored.
- **Pre-commit:** Husky runs lint-staged (ESLint + Prettier on staged files).

## Adding a feature

1. Update `convex/schema.ts` if new tables are needed.
2. Add Convex functions in `convex/<feature>.ts` with `args` / `returns` validators.
3. Add a route under `src/app/<feature>/`.
4. Use `useQuery` / `useMutation` from `convex/react` with `api` from `convex/_generated/api`.

More architecture detail: `AI_README.md`. Human-facing setup: `README.md`.
