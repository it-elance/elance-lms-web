# Elance LMS — Student Web — Installation Guide

Repository: `elance-lms-web`

## Prerequisites

- **Node.js** v20 or v22
- **Yarn** — npm is explicitly blocked (a `preinstall` script aborts under npm, and `.npmrc` sets `engine-strict=true`)
- The backend (`elance_lms_backend`) running and reachable — this app has no server-side database of its own

## Steps

1. **Clone & enter the project**

   ```bash
   git clone <repo-url> elance-lms-web
   cd elance-lms-web
   ```

2. **Install dependencies** (must use Yarn)

   ```bash
   yarn install
   ```

3. **Create your environment file** `.env` in the project root (all env files are git-ignored) and fill in the values from the section below.

4. **Start the dev server** (Turbopack)

   ```bash
   yarn dev
   ```

   → http://localhost:3000

5. **Production build & run**
   ```bash
   yarn build
   yarn start
   ```

## Environment Variables (`.env`)

```dotenv
# Backend API base URL (include the /student prefix)
NEXT_PUBLIC_API_URL=http://localhost:3011/student

# TPStreams organization id for video embeds
NEXT_PUBLIC_TPSTREAMS_ORG_ID=your_tpstreams_org_id
```

| Variable                       | Description                                                                                                                 |
| :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Base URL of `elance_lms_backend`, including the `/student` prefix. Falls back to `http://localhost:3011/student` if omitted |
| `NEXT_PUBLIC_TPSTREAMS_ORG_ID` | TPStreams org id, used to build the video embed URL                                                                         |

Only `NEXT_PUBLIC_*` variables are needed since this is a pure client app.

## Available scripts

| Command         | Description                        |
| :-------------- | :--------------------------------- |
| `yarn dev`      | Start local dev server (Turbopack) |
| `yarn build`    | Production build                   |
| `yarn start`    | Serve production build             |
| `yarn lint`     | Check lint errors                  |
| `yarn lint:fix` | Auto-fix lint errors               |
| `yarn format`   | Format all files with Prettier     |

## Notes

- The auth JWT is stored in **`localStorage`** under `accessToken`.
- Auto-logout on `401` is currently commented out in the response interceptor (`services/apiClient.ts`).
