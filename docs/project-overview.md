# Elance LMS Web — Project Context

A modern, student-facing **Learning Management System (LMS)** web client built with Next.js 16 (App Router) and React 19. It is the browser front-end that students use to log in, browse their enrolled programs/papers, watch secured video lectures, download study materials, take notes, track learning analytics, and manage their account.

> This document is the high-level context for the `elance-lms-web` repository. For contribution/tooling specifics see the root [`README.md`](../README.md).

---

## 1. Tech Stack

### Core framework & language

| Layer           | Technology                                    | Version  | Notes                                                     |
| :-------------- | :-------------------------------------------- | :------- | :-------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org/)                | `16.1.1` | App Router, Turbopack                                     |
| UI library      | [React](https://react.dev/)                   | `19.2.3` | React 19 (with `react-dom` 19.2.3)                        |
| Language        | [TypeScript](https://www.typescriptlang.org/) | `^5`     | `strict` mode fully enabled                               |
| Styling         | [Tailwind CSS](https://tailwindcss.com/)      | `^4`     | v4 via `@tailwindcss/postcss`, CSS-variable design tokens |
| Package manager | [Yarn](https://yarnpkg.com/)                  | —        | **npm is blocked** (see below)                            |

### Key libraries

| Purpose                      | Library                                                       | Notes                                                     |
| :--------------------------- | :------------------------------------------------------------ | :-------------------------------------------------------- |
| Server state / data fetching | [`@tanstack/react-query`](https://tanstack.com/query) `^5.99` | All API data flows through React Query; devtools included |
| HTTP client                  | [`axios`](https://axios-http.com/) `^1.15`                    | Single configured `apiClient` with interceptors           |
| Animations                   | [`framer-motion`](https://www.framer.com/motion/) `^12.23`    | Page/route transitions, sidebar, login flow               |
| Icons                        | [`lucide-react`](https://lucide.dev/) `^0.562`                | Plus custom SVG mask icons in `/public`                   |
| Toasts / notifications       | [`react-hot-toast`](https://react-hot-toast.com/) `^2.6`      | Themed via CSS variables                                  |
| Vector animation             | [`@rive-app/react-canvas`](https://rive.app/) `^4.25`         | Login splash intro (`intro-animation.riv`)                |

### Tooling & code quality

- **ESLint** (`^9`) with `eslint-config-next` and strict TypeScript rules (`@typescript-eslint`)
- **Prettier** (`^3.7`) — single quotes, semicolons, 2-space tabs, 80-col print width, ES5 trailing commas
- **Husky** (`^9.1`) — Git hooks
- **lint-staged** (`^16.2`) — runs `eslint --fix` + `prettier --write` on staged files
- **Pre-commit hook** runs `lint-staged`, blocking commits that fail linting/formatting

> **npm is explicitly blocked.** A `preinstall` script aborts if invoked through npm, and `.npmrc` sets `engine-strict=true` + `package-lock=false`. Always use **Yarn**.

---

## 2. Services & External Integrations

The web app is a **pure client**: it holds no server-side database and talks to a backend REST API. All persistence, auth issuance, and business logic live in the separate `elance_lms_backend` service.

| Service                                                   | Role                           | How it's used                                                                                                                                         |
| :-------------------------------------------------------- | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend REST API** (`elance_lms_backend`)               | Source of all data & auth      | Base URL from `NEXT_PUBLIC_API_URL` (default `http://localhost:3011/student`); all endpoints under the `/student` prefix                              |
| **TPStreams**                                             | Secure video streaming/DRM     | Lectures play through an embedded TPStreams iframe using a per-lecture `access_token` returned by the API. Org id from `NEXT_PUBLIC_TPSTREAMS_ORG_ID` |
| **AWS S3** (`mybucketelance.s3.ap-south-1.amazonaws.com`) | Media / study material storage | Thumbnails & downloadable materials served from S3 (`ap-south-1`); whitelisted in `next.config.ts` image domains                                      |
| **Vimeo CDN** (`i.vimeocdn.com`)                          | Video thumbnails               | Whitelisted image remote pattern                                                                                                                      |
| **Unsplash** (`images.unsplash.com`)                      | Placeholder/demo imagery       | Whitelisted image remote pattern                                                                                                                      |
| **Rive**                                                  | Login intro animation          | Local `.riv` asset rendered client-side                                                                                                               |

### Authentication model

- **Passwordless OTP login** — user submits a **mobile number** (`+91` hardcoded country code) **or email**; backend sends an OTP; user verifies the 4-digit code.
  - `POST /login/store` → send OTP
  - `POST /login/verify/otp` → verify, returns `{ token }`
- The JWT `token` is stored in **`localStorage` under `accessToken`**.
- `apiClient` request interceptor attaches `Authorization: Bearer <token>` to every request.
- Route protection is handled **client-side** in [`LayoutWrapper`](../components/LayoutWrapper.tsx): unauthenticated users are redirected to `/`, authenticated users on the login page are redirected to `/home`.

> ⚠️ Note: auto-logout on `401` is currently commented out in the response interceptor ([`apiClient.ts`](../services/apiClient.ts)).

---

## 4. Architecture Overview

### 4.1 High-level shape

```
Browser (Next.js client)
        │  Bearer token (localStorage)
        ▼
apiClient (axios) ──► Backend REST API (/student/*)
        │                        │
        │                        ├─► AWS S3 (materials, thumbnails)
        ▼                        └─► TPStreams (video access tokens)
React Query cache ──► Hooks ──► Pages/Components ──► UI
```

The app follows a clean **layered client architecture**:

```
app/ (routes)  →  hooks/ (React Query)  →  services/ (axios API)  →  Backend
     │                    │                       │
components/           types/ (TS contracts)   constants/ (config)
```

### 4.2 Directory structure

```
elance-lms-web/
├── app/                    # Next.js App Router — routes, layouts, pages
│   ├── layout.tsx          # Root layout: providers, theme boot script, Toaster
│   ├── page.tsx            # Entry (redirects via LayoutWrapper)
│   ├── login/              # OTP login flow (mobile/email → OTP)
│   ├── home/               # Dashboard / home feed
│   ├── learning/           # "My Learning" + video player page
│   ├── course/             # Course / paper detail
│   ├── favourites/         # Saved lectures & materials
│   ├── analytics/          # Learning analytics
│   ├── account/            # Profile, personal info, admission details, theme
│   └── globals.css         # Tailwind v4 + design-token CSS variables
│
├── components/             # Reusable UI + providers
│   ├── QueryProvider.tsx   # React Query client + devtools
│   ├── ThemeProvider.tsx   # light/dark/system theme context
│   ├── LayoutWrapper.tsx   # Auth guard + app shell (Header + Sidebar)
│   ├── Header.tsx / Sidebar.tsx
│   ├── VideoPlayer.tsx     # TPStreams iframe embed
│   ├── learning/           # Overview, Materials, Notes tabs
│   ├── favourites/         # Favourite cards + filter modal
│   ├── modals/             # Note add/edit/delete, logout, announcement
│   └── search/             # Global search results
│
├── hooks/                  # One React Query hook per domain feature
│   ├── useHomeData, useMyLearning, useChapters, useCourseLectures
│   ├── useLectureVideo, useMaterials, usePapers, usePaperDetails
│   ├── useNotes, useFavourite, useNotifications, useAnalyticsData
│   ├── useAdmissionDetails, useSwitchProgram, useGlobalSearch
│   └── useDebounce         # Utility (search input debouncing)
│
├── services/
│   ├── apiClient.ts        # Configured axios instance + interceptors
│   └── api.service.ts      # All API endpoint functions (typed)
│
├── types/                  # TypeScript contracts per domain (auth, home,
│                           #   learning, lecture, material, note, analytics,
│                           #   favourite, notification, paper, search, common)
├── constants/config.ts     # API_URL resolution
├── public/                 # SVG icons (light/dark variants), Rive, images
├── next.config.ts          # Image domains, Turbopack root
└── (eslint, prettier, husky, tsconfig, postcss configs)
```

### 4.3 Data-flow pattern (the core convention)

Every feature follows the same vertical slice, which makes the codebase highly predictable:

1. **`types/*.types.ts`** — defines the API request/response contracts.
2. **`services/api.service.ts`** — a typed function calling `apiClient` (e.g. `homeApi`, `lectureVideoApi`, `favouriteApi`). It unwraps the backend's nested `{ data: { data } }` envelopes and returns clean domain objects.
3. **`hooks/use*.ts`** — a React Query `useQuery`/`useMutation` wrapper with a stable `queryKey`, exposing `{ data, isLoading, error }`.
4. **`app/*` & `components/*`** — consume the hook and render.

**React Query configuration** ([`QueryProvider.tsx`](../components/QueryProvider.tsx)):

- `staleTime`: 5 min, `gcTime`: 10 min
- `retry`: 1, `refetchOnWindowFocus`: false

**Optimistic updates**: mutations like favouriting ([`useFavourite`](../hooks/useFavourite.ts)) use `onMutate`/`onError` rollback and `onSuccess` invalidation to update the cache instantly before the server confirms.

### 4.4 API surface (backend endpoints consumed)

All under the `/student` prefix:

| Domain          | Endpoints                                                                                                                                             |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth            | `POST /login/store`, `POST /login/verify/otp`                                                                                                         |
| Home            | `GET /home`, `GET /home/my-learning`, `GET /home/search`                                                                                              |
| Course          | `GET /course/lecture-by-paper`, `GET /course/video-by-lecture`, `GET /course/paper-details`, `GET /course/material-by-lecture`, `POST /course/switch` |
| Papers/Chapters | `GET /paper`, `GET /chapter`                                                                                                                          |
| Notes           | `GET/POST/PUT/DELETE /note`                                                                                                                           |
| Favourites      | `POST /favourite`, `GET /favourite/lectures`, `GET /favourite/materials`                                                                              |
| Notifications   | `GET /notification`, `POST /notification/read`, `POST /notification/read/all`                                                                         |
| Analytics       | `GET /analytics`                                                                                                                                      |
| Admission       | `GET /admission/details`                                                                                                                              |

### 4.5 Application shell & routing

- **Root layout** ([`app/layout.tsx`](../app/layout.tsx)) wraps the tree in `QueryProvider → ThemeProvider → Toaster → LayoutWrapper`. An inline `<head>` script sets the theme **before paint** to avoid a flash of wrong theme (FOUC).
- **`LayoutWrapper`** is the auth gate and app chrome. It reads `accessToken`, redirects appropriately, and — once authenticated — renders the `Header`, a responsive `Sidebar`, and an animated `<main>` content region.
- **Navigation** (`Sidebar`): Home, My Learning, Favourites, Analytics, Account. On mobile the sidebar collapses to a bottom nav bar (Analytics hidden on mobile); on desktop it's a collapsible/lockable left rail.

### 4.6 Theming system

- **Three modes**: `light` / `dark` / `system`, managed by [`ThemeProvider`](../components/ThemeProvider.tsx) via a React context (`useTheme`).
- Preference persists in `localStorage` (`theme`); `system` mode follows `prefers-color-scheme` and re-reacts to OS changes.
- The theme is applied by toggling `data-theme="dark"` on `<html>`; all colors are **CSS custom properties** (e.g. `--color-primary-500`, `--color-bg-primary`, `--color-text-primary`) defined in [`globals.css`](../app/globals.css), so components style via Tailwind arbitrary values like `bg-(--color-bg-primary)`.
- Many icons ship as **paired light/dark SVGs** (e.g. `pdf-light.svg` / `pdf-dark.svg`) and/or as CSS mask icons tinted with theme variables.

### 4.7 Secure video playback

Lecture video is never exposed as a raw URL. The flow:

1. `GET /course/video-by-lecture?lecture_id=…` returns a per-lecture `access_token` + `video_id` (asset id).
2. [`VideoPlayer`](../components/VideoPlayer.tsx) embeds `https://app.tpstreams.com/embed/{ORG_ID}/{assetId}/?access_token={token}` in a sandboxed iframe with a loading shimmer.

---

## 5. Notable Conventions & Design Decisions

- **Strict TypeScript everywhere** — `strict`, `noImplicitAny`, `strictNullChecks`, etc. all on; `allowJs: false`.
- **Path alias** `@/*` → project root (e.g. `@/services/api.service`).
- **Feature-sliced hooks** — one hook file per domain keeps data logic out of components and centralizes query keys/invalidation.
- **Client-first auth** — token in `localStorage`, guard in a client wrapper (no middleware-based server auth currently).
- **Turbopack** enabled for dev via `next.config.ts`.
- **No test suite** is present in the repo at this time (there is a `/coverage` gitignore entry reserved for future testing).
- **Environment-driven config** — API base and TPStreams org are the only external knobs, both `NEXT_PUBLIC_`.

---

## 6. Related Repositories

This web client is one of three sibling projects in the LMS monorepo-style workspace:

| Repo                               | Purpose                                                                   |
| :--------------------------------- | :------------------------------------------------------------------------ |
| **`elance-lms-web`** _(this repo)_ | Student-facing web client (Next.js)                                       |
| **`elance_lms_backend`**           | REST API, auth, business logic, data (serves `/student/*` and admin APIs) |
| **`elance_lms_frontend`**          | Separate front-end (e.g. admin/other client)                              |

---

_Generated as a codebase context overview for the `elance-lms-web` project._
