# LuxeLiving Frontend

React 19 + Vite + Tailwind CSS 4 single-page app for the LuxeLiving Real Estate platform. Deploys standalone to **Vercel** and talks to the backend API (see `../backend`) over HTTP.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

By default this expects the backend running locally at `http://localhost:4000` (see `../backend/README.md`). Set `VITE_API_URL` in `.env` to point elsewhere.

If the API is unreachable, most public-facing pages gracefully fall back to bundled sample data (`src/data/properties.ts`) so the UI still renders — but admin actions (login, CRUD, stats, WhatsApp tools) require a live backend.

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API, no trailing slash (e.g. `https://luxeliving-backend.onrender.com`) |

Vite only exposes variables prefixed with `VITE_` to client code, and they're baked in at build time — so set `VITE_API_URL` in Vercel's project settings **before** deploying/rebuilding.

## Deploying to Vercel

1. Push this `frontend/` directory to a Git repo (or the monorepo containing both `frontend/` and `backend/`).
2. In Vercel: **New Project** → import the repo → set **Root Directory** to `frontend`.
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output directory `dist` (already declared in `vercel.json`).
4. Add environment variable `VITE_API_URL` = your deployed backend URL (e.g. `https://luxeliving-backend.onrender.com`).
5. Deploy. Grab the resulting `*.vercel.app` URL (or your custom domain) and set it as `FRONTEND_URL` in the backend's environment on Render so CORS allows it.

## Admin access

The floating "Admin Panel" button / footer link opens the admin console. Default seeded credentials (change them via `ADMIN_EMAIL` / `ADMIN_PASSWORD` on the backend before going live):

```
Email:    admin@luxeliving.in
Password: luxe2026
```
