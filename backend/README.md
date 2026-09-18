# LuxeLiving Backend (API)

Production-ready Express + TypeScript REST API for the LuxeLiving Real Estate platform. Designed to be deployed standalone on **Render**, decoupled from the frontend (which deploys separately to **Vercel**).

## Stack

- Node.js + Express + TypeScript (compiled with `tsc`, ESM)
- [lowdb](https://github.com/typicode/lowdb) — a lightweight JSON file database. Simple, dependency-free, and durable as long as it's backed by a persistent disk (see below). Swap for Postgres/MySQL later without touching route logic if you outgrow it.
- `helmet`, `cors`, `compression`, `express-rate-limit`, `morgan` for security/production hardening
- `jsonwebtoken` + `bcryptjs` for admin authentication

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:4000` by default. Data is stored in `./data/db.json` (auto-created and seeded on first run).

## Environment variables

See `.env.example`. Key ones:

| Variable | Description |
|---|---|
| `PORT` | Port to listen on (Render sets this automatically) |
| `FRONTEND_URL` | Comma-separated list of allowed frontend origins for CORS (your Vercel URL + custom domain) |
| `DATA_DIR` | Directory for the JSON data file. Point this at a mounted persistent disk in production |
| `JWT_SECRET` | Secret used to sign admin session tokens — **must** be a long random string in production |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed credentials for the first admin account (only used the first time the database is created) |

## API surface

All routes are namespaced under `/api`:

- `GET /api/health` — health check (used by Render)
- `GET/POST/PUT/DELETE /api/properties` — property listings (writes require admin auth)
- `POST /api/tours`, `GET/PATCH/DELETE /api/tours` (reads/writes other than creating require admin auth)
- `POST /api/inquiries`, `GET/PATCH/DELETE /api/inquiries` (same pattern)
- `POST /api/newsletter`, `GET/DELETE /api/newsletter`
- `GET/PUT /api/agent`
- `POST /api/mortgage/calculate`
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/me`, `GET /api/admin/stats`
- `GET/POST/DELETE /api/admin/whatsapp/*` — WhatsApp broadcast tooling (all admin-only)

Admin-protected routes require `Authorization: Bearer <token>`, where `<token>` is the JWT returned by `/api/admin/login`.

## Deploying to Render

**Option A — Blueprint (recommended):** this repo includes `render.yaml`. In the Render dashboard, choose "New +" → "Blueprint", point it at your repo, and Render will provision the service (with a 1 GB persistent disk mounted at `/data`) from the file. You'll be prompted to fill in `FRONTEND_URL` and `ADMIN_PASSWORD`.

**Option B — Manual web service:**

1. New + → Web Service → connect your repo, set **Root Directory** to `backend`.
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add a **persistent disk** (Settings → Disks), e.g. 1 GB mounted at `/data`, and set `DATA_DIR=/data` — otherwise the JSON store resets on every deploy/restart.
5. Add environment variables from `.env.example` (`FRONTEND_URL` should be your Vercel deployment URL, `JWT_SECRET` should be freshly generated, e.g. `openssl rand -base64 48`).
6. Set the health check path to `/api/health`.

Once deployed, note the service URL (e.g. `https://luxeliving-backend.onrender.com`) — you'll set this as `VITE_API_URL` in the frontend's Vercel project.

## Notes on data persistence

This backend intentionally avoids requiring an external managed database to keep the deployment simple. It persists to a JSON file via lowdb. On Render, **attach a persistent disk** (see above) or the data directory will be wiped on every deploy. For heavier production workloads (concurrent writers, larger datasets, backups), swap the `db.ts` module for a real database (e.g. Render Postgres) — the route handlers only depend on the shape in `src/types.ts`, so the migration is localized.
