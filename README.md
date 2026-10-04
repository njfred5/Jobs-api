# Jobs API — Remote Jobs Board

A full-stack remote jobs board. An **Express** API fetches live listings from the public [Jobicy API](https://jobicy.com/jobs-rss-feed), cleans and caches them, and a **React** frontend lets you search, filter, sort and save the ones you like once you have an account.

**🔗 Live demo:** https://jobs-api-4w0z.onrender.com  
*(hosted on Render's free tier — the first load can take ~30 s while the server wakes up)*

<!-- Add a screenshot: ![Screenshot](docs/screenshot.png) -->

## Features

-  **Search & filters** — keyword, region, industry, job type, sort by newest / salary / company
- **Saved jobs** — create an account and keep a personal shortlist (stored server-side, follows you across devices)
-  **Authentication** — register / login with hashed passwords (bcrypt) and JWT sessions
-  **Fast** — responses from Jobicy are cached in memory (15 min by default), requests are debounced and cancelled on the client
- **Dark mode** and responsive layout
- **Hardened API** — Helmet security headers, rate-limited auth routes, input validation, centralised error handling

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, plain CSS (custom properties for theming) |
| Backend | Node.js 20+, Express 5 (ES modules) |
| Database | SQLite via `better-sqlite3` |
| Auth | `bcryptjs`, `jsonwebtoken` |
| Security | `helmet`, `express-rate-limit` |
| Hosting | Render |

##  Project structure

```
.
├── src/                    # Express API
│   ├── index.js            # entry point: init DB, start server
│   ├── app.js              # middleware, routes, serves the React build
│   ├── config/             # env config + SQLite connection
│   ├── routes/             # URL → controller mapping
│   ├── controllers/        # HTTP layer (req/res)
│   ├── services/           # business logic (Jobicy calls + cache, auth)
│   ├── models/             # SQL queries (User, SavedJob)
│   ├── middleware/         # JWT auth, logger, error handling
│   └── utils/
├── client/                 # React app (Vite)
│   └── src/
│       ├── App.jsx
│       ├── api.js          # fetch wrapper
│       ├── components/     # Header, SearchFilters, JobCard, JobList, AuthModal
│       ├── context/        # AuthContext (session)
│       └── hooks/          # useJobs, useSavedJobs, useDebounce
├── test/                   # node:test unit tests
└── render.yaml             # Render deployment blueprint
```

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | – | Health check |
| GET | `/api/jobs` | – | List jobs. Query: `q`, `geo`, `industry`, `tag`, `type`, `sort` (`newest`\|`salary`\|`company`), `count` (1–50) |
| GET | `/api/jobs/filters` | – | Available regions, industries and job types |
| POST | `/api/auth/register` | – | Body: `{ name, email, password }` → `{ user, token }` |
| POST | `/api/auth/login` | – | Body: `{ email, password }` → `{ user, token }` |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/saved` | Bearer | List saved jobs |
| POST | `/api/saved` | Bearer | Save a job (the job object returned by `/api/jobs`) |
| DELETE | `/api/saved/:jobId` | Bearer | Remove a saved job |

Authenticated requests send `Authorization: Bearer <token>`.

```bash
curl "http://localhost:3000/api/jobs?q=react&geo=usa&sort=salary&count=10"
```

## Run locally

Requires **Node.js 20+**.

```bash
git clone https://github.com/njfred5/Jobs-api.git
cd Jobs-api

npm install
cp .env.example .env          # then edit JWT_SECRET

# Option A — development (hot reload on both sides, two terminals)
npm run dev                    # API on http://localhost:3000
npm install --prefix client
npm run client:dev             # React on http://localhost:5173 (proxies /api to :3000)

# Option B — production-like (API serves the built React app)
npm run build
npm start                      # everything on http://localhost:3000
```

Run the tests with `npm test`.

### Environment variables

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `3000` | Render sets this automatically |
| `NODE_ENV` | `development` | |
| `DATABASE_URL` | `./database.sqlite` | Path of the SQLite file |
| `JWT_SECRET` | dev placeholder | **Required in production**, use a long random string |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `JOBS_CACHE_MINUTES` | `15` | Jobicy response cache |

## ☁️ Deploy on Render

1. Push this repo to GitHub.
2. On Render: **New → Blueprint** and select the repo (it reads `render.yaml`), or create a **Web Service** manually with:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Env vars: `NODE_ENV=production`, `JWT_SECRET=<random string>`
3. Every push to the connected branch redeploys automatically.

> **Free tier note:** Render's free web services have an ephemeral disk, so the SQLite file (users and saved jobs) is wiped on each redeploy or restart. For persistent data, attach a Render persistent disk (paid) and point `DATABASE_URL` to it, or migrate to PostgreSQL.

## Roadmap

- [ ] PostgreSQL for persistent storage on the free tier
- [ ] Pagination / infinite scroll
- [ ] Job application tracker (applied / interview / offer)
- [ ] Integration tests with Supertest

## Credits

Job data provided by [Jobicy](https://jobicy.com). Please respect their [fair-use guidelines](https://jobicy.com/jobs-rss-feed) — this project caches results to keep requests low.

## Author

**Fred Mathys Njike N.** — [GitHub @njfred5](https://github.com/njfred5)
