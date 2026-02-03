# App Architecture & Context

## Overview

This is a modern web application built with **Next.js 16** (App Router) and **Convex** as the backend-as-a-service (BaaS). It uses **Tailwind CSS v4** for styling and **Convex Auth** for authentication.

## Tech Stack

- **Framework**: Next.js 16.1.4 (React 19)
- **Backend**: Convex 1.31.6
- **Authentication**: Convex Auth (`@convex-dev/auth`)
- **Styling**: Tailwind CSS v4, specialized with `clsx` and `tailwind-merge`
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **File Storage**: `@vercel/blob` (referenced in dependencies) and/or Convex Storage (referenced in schema)

## Project Structure

- `convex/`: Backend logic, schema, and auth configuration.
  - `schema.ts`: Database definition.
  - `auth.ts`: Auth providers and callbacks.
  - `*.ts`: Backend functions (queries/mutations).
- `src/app/`: Next.js App Router pages.
  - `page.tsx`: Landing page (redirects to `/dashboard` or `/signin`).
  - `signin/`: Authentication page.
  - `dashboard/`: Main protected application area.
  - `gallery/`, `messages/`, `prayer-requests/`, `profile/`, `users/`: Feature routes.
- `src/components/`: Reusable UI components.
- `src/providers/`: Context providers (e.g., `ConvexClientProvider`).

## Major Systems

### Authentication

- **Implementation**: Convex Auth.
- **Providers**: Password, GitHub, Google.
- **Role Management**: Users are assigned `role: "user"` by default. Logic exists to promote the first user to admin.
- **Flow**:
  - `convex/auth.ts`: Configures providers.
  - `src/app/signin/page.tsx`: Login UI.
  - `src/app/page.tsx`: Checks `isAuthenticated` and redirects accordingly.

### Data Model (Schema)

Defined in `convex/schema.ts`. Key tables:

- `users`: Auth + profile fields (`role`, `imageCount`, `maxUploads`).
- `images`: User uploads.
- `messages`: Family message feed.
- `prayerRequests`: Prayer tracking feature.
- `settings`: Key-value store.
- `weather`: Caching weather data.

### Main Page Flow

1.  **Entry**: User inspects root `/`.
2.  **Redirect**:
    - If unauthenticated -> `/signin`.
    - If authenticated -> `/dashboard`.
3.  **Dashboard**: The core app experience starts at `/dashboard`.

## How to Add a Core Feature

To add a new feature (e.g., "Todos"):

1.  **Backend (Convex)**:
    - Update `convex/schema.ts`: Define `todos` table.
    - Create `convex/todos.ts`: Export `query` and `mutation` functions (e.g., `list`, `add`, `toggle`).
    - _Tip_: Use `v` from `convex/values` for argument validation.

2.  **Frontend (Next.js)**:
    - Create `src/app/todos/page.tsx`: New route.
    - Use `useQuery` to fetch data: `const todos = useQuery(api.todos.list)`.
    - Use `useMutation` for actions: `const addTodo = useMutation(api.todos.add)`.

3.  **UI**:
    - Build components in `src/components/` using Tailwind classes.
    - Ensure responsive design (e.g., `md:flex`).

4.  **Navigation**:
    - Add link to `/todos` in the main navigation component (likely in `src/app/dashboard` layout or sidebar).
