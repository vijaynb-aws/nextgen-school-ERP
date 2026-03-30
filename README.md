# EduCore — School Management System

A modular, production-ready school management web application.
Each concern is separated into its own file for easy maintenance.

---

## Project Structure

```
educore/
│
├── index.html                  ← Main HTML shell (structure only, no logic)
│
├── css/
│   ├── main.css                ← Design tokens, reset, typography, layout
│   ├── layout.css              ← Sidebar, topbar, navigation
│   └── components.css          ← Cards, buttons, forms, tables, modals, toasts
│
├── js/
│   ├── app.js                  ← Entry point — bootstraps everything
│   ├── ui.js                   ← Navigation, toasts, modals, table helpers
│   ├── db.service.js           ← DB abstraction (Supabase OR local REST)
│   ├── dashboard.js            ← Dashboard stats, chart, recent admissions
│   ├── students.js             ← Student CRUD, ID cards, promote
│   ├── employees.js            ← Employee CRUD, staff cards, letters
│   └── accounts.js             ← Income/expense CRUD, statement
│
├── config/
│   ├── db.config.js            ← ⚙️  DB provider, table names, storage buckets
│   └── app.config.js           ← ⚙️  School info, theme, features, pagination
│
├── api/                        ← On-prem backend only (skip for Supabase)
│   ├── server.js               ← Express app entry point
│   ├── db.pool.js              ← PostgreSQL connection pool
│   └── routes/
│       ├── students.route.js   ← REST endpoints for students
│       ├── employees.route.js  ← REST endpoints for employees
│       ├── accounts.route.js   ← REST endpoints for accounts
│       ├── classes.route.js    ← REST endpoints for classes
│       ├── institute.route.js  ← REST endpoints for institute profile
│       ├── auth.route.js       ← Login / logout / session
│       └── upload.route.js     ← File upload handling
│
├── db/
│   ├── schema.sql              ← All CREATE TABLE statements
│   └── seed.sql                ← Sample data for development
│
├── assets/                     ← Logo, favicon, images
├── .env.example                ← Copy to .env and fill in values
├── .gitignore
└── package.json
```

---

## Quick Start

### Option A — Cloudflare Pages + Supabase (recommended)

1. Create a Supabase project at https://supabase.com
2. Run `db/schema.sql` in the Supabase SQL editor
3. Run `db/seed.sql` for sample data
4. Edit `config/db.config.js` — set `provider: 'supabase'` and paste your URL + anon key
5. Push to GitHub, then deploy via Cloudflare Pages (connect repo → no build command needed)

### Option B — On-premises

1. Install: `sudo apt install nodejs npm postgresql nginx`
2. Create DB: `createdb schooldb` then `psql -d schooldb -f db/schema.sql`
3. Copy `.env.example` to `.env` and fill in `DB_PASSWORD` etc.
4. Install deps: `npm install`
5. Start API: `npm run api` (or `pm2 start api/server.js`)
6. Serve frontend: configure Nginx to serve the project folder
7. Add HTTPS: `certbot --nginx -d yourdomain.com`

---

## What to Edit and Where

| What you want to change        | File to edit                     |
|-------------------------------|----------------------------------|
| Switch Supabase ↔ local DB    | `config/db.config.js`            |
| School name, phone, address   | `config/app.config.js`           |
| Colors / theme                | `css/main.css` (`:root` vars)    |
| Sidebar or topbar layout      | `css/layout.css`                 |
| Button / card / table styles  | `css/components.css`             |
| Page HTML structure           | `index.html`                     |
| Navigation logic              | `js/ui.js`                       |
| All DB queries                | `js/db.service.js`               |
| Student forms & table         | `js/students.js`                 |
| Employee forms & table        | `js/employees.js`                |
| Income / expense / statement  | `js/accounts.js`                 |
| Dashboard stats & chart       | `js/dashboard.js`                |
| PostgreSQL table structure    | `db/schema.sql`                  |
| Sample / test data            | `db/seed.sql`                    |
| On-prem API server            | `api/server.js`                  |
| On-prem DB connection         | `api/db.pool.js`                 |

---

## Dependencies

**Frontend** — zero build step, vanilla JS ES modules
- Supabase JS SDK (CDN, optional)

**Backend (on-prem only)**
- express, pg, cors, helmet, morgan, multer, jsonwebtoken, bcryptjs, dotenv
