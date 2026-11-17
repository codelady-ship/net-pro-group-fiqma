# Net Pro Group – IT & network equipment company website (full stack)

[![Live demo](https://img.shields.io/badge/live-GitHub%20Pages-435072?style=flat-square)](https://codelady-ship.github.io/net-pro-group-fiqma/)

A multi-page, responsive company website for **Net Pro Group**, a generic IT infrastructure, network and power equipment company. The project was **built from a Figma design** as a practice project: the company copy is written for the portfolio, and the address, phone numbers and e-mail are clearly marked sample data. Contact and product inquiries go to a **Node.js + Express + MongoDB API** (`backend/`, deployable to Render) with an admin workflow; without the API the forms fall back to `mailto:`.

> AZ: Figma dizaynı əsasında hazırlanmış təlim layihəsi — İT və şəbəkə avadanlıqları şirkəti üçün çoxsəhifəli, responsiv sayt. Əlaqə məlumatları nümunədir. Əlaqə və məhsul sorğuları Express + MongoDB API-yə yazılır (admin üçün status, qeyd, statistika); server əlçatan olmayanda forma e-poçt proqramını açır.

![Net Pro Group screenshot](docs/screenshot.png)

Before/after screenshots of the 2026 redesign: [`docs/redesign/`](docs/redesign/).

## Features

- 13 pages: home, about, 6 product categories, services, gallery, contact, site search and a custom 404 page.
- 2026 redesign: dark "ink" hero and footer, the logo's slate navy plus one cyan accent, Inter type, inline SVG icons. It reuses only the photos and logos that were already in `img/`, recoloured and cropped with CSS.
- Home page with a static hero, product-category and service grids, partner logo wall and a scroll-snap gallery (no autoplay; honours `prefers-reduced-motion`).
- Sticky header with a keyboard-accessible products dropdown; full-height mobile menu (focus moves into it, Escape closes it, the page behind is `inert`).
- Optional hero time-lapse video behind a feature flag (`HERO_VIDEO.ready` in `tools/data.js`, currently `false`). To turn it on, add `assets/media/hero-build.mp4` (optionally `.webm`) and `assets/media/hero-build-poster.jpg` (the clip's final frame), then set the flag. The video is muted and `playsinline`, and it loads only when the hero is on screen. It plays once and holds the last frame, has a replay button, pauses off screen, and shows only the poster under reduced motion. It has a fixed aspect ratio and an "AI ilə yaradılmış video" caption. The build fails if the flag is on and a file is missing.
- Catalogue pages with a category sidebar (a chip row on phones), product cards and a "Broşür sorğusu" button that pre-fills the inquiry form.
- Contact forms with validation. With the API online the inquiry is **saved in MongoDB** and the visitor gets a reference like `NPG-3F9A1C` (shown only when the API really returned one; otherwise the mail-app fallback runs); the product name from the "Broşür sorğusu" link is stored as the inquiry topic. Without the API (not configured, asleep or unreachable within 8 s) the form opens the visitor's mail app with a prepared message (`mailto:`).
- Spam protection: a hidden honeypot field (bots are stored as `spam` and hidden from the list) and rate limiting.
- Client-side site search over pages, products and services (`search-index.json`).
- Gallery lightbox built on the native `<dialog>` element, with previous/next buttons and arrow keys.
- Contact page with a visible FAQ (`<details>`), visible form labels, inline field errors (`aria-invalid` / `aria-describedby`) and a status box that shows the reference number.
- SEO/GEO: unique titles and descriptions, `lang="az"`, canonical URLs, Open Graph/Twitter tags with a 1200×630 `img/og-image.jpg`, and JSON-LD (Organization, WebSite + SearchAction, BreadcrumbList, Product and Service lists, FAQPage that matches the visible FAQ). `robots.txt`, `sitemap.xml` and `llms.txt` are generated; there is one `h1` per page and alt text on every image.
- Optimised images: WebP photos, `width`/`height` on every `<img>`, lazy loading below the fold, and a responsive `srcset` plus preload for the hero. `tools/optimize-images.js` is a dev-only script that makes the derived sizes from the existing images.

Brand logos (Vertiv, Makelsan, Long and others) belong to their owners and are used only to reproduce the design.

## Tech stack

- **Frontend:** HTML5, CSS3 (design tokens in custom properties, Grid, Flexbox, container queries), vanilla JavaScript. No framework, no runtime dependencies and no build step on the server.
- **Backend:** Node.js 20+, Express 5, MongoDB with Mongoose 8, zod validation (Azerbaijani error messages), JWT admin auth, CORS allow-list, rate limiting.
- **Tests:** `node:test` + supertest on an in-memory MongoDB.
- **Hosting:** GitHub Pages (site), Render free web service (API, `render.yaml`), MongoDB Atlas free cluster.

### REST API

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/api/health` | public | Status and database connection |
| POST | `/api/inquiries` | public (rate limited) | `{ name, email, phone?, message, topic?, page? }` → `201 { reference }`; `400` with field messages in Azerbaijani |
| POST | `/api/auth/login` | public (rate limited) | `{ email, password }` → `{ token }` |
| GET | `/api/admin/inquiries?status=new&q=ups&page=1` | admin | Paged list (50 per page), search, spam hidden unless `status=spam` |
| GET / PATCH / DELETE | `/api/admin/inquiries/:reference` | admin | Read; change status (`new`, `in_progress`, `closed`, `spam`) and/or add a note; delete |
| GET | `/api/admin/stats` | admin | Counts per status and the 10 most asked-about topics |

Admin calls need `Authorization: Bearer <token>`.

The pages are generated by a small, dependency-free Node script, and the generated files are committed so GitHub Pages serves them as they are:

```bash
node tools/build-pages.js   # writes *.html, netprogroup.css, main.js, search-index.json, sitemap.xml, robots.txt, llms.txt
```

- `tools/data.js` holds the content.
- `tools/lib/` holds the layout, form, image, icon and SEO helpers.
- `tools/pages/` holds the page modules.
- `tools/css/*.css` are joined into `netprogroup.css`, and `tools/js/*.js` into `main.js`.

Edit the sources, not the generated files.

## Run locally

```bash
git clone https://github.com/codelady-ship/net-pro-group-fiqma.git
cd net-pro-group-fiqma
npx serve .      # search needs a local server because it fetches search-index.json
```

API (needs MongoDB: a free Atlas cluster or a local `mongod`):

```bash
cd backend
cp .env.example .env   # fill MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run dev            # http://localhost:4000
npm test               # API tests on an in-memory MongoDB
```

Then open a page with `?api=` (honoured only when the page runs on `localhost`/`127.0.0.1`, so a crafted link cannot redirect the live form), e.g. `http://localhost:3000/elaqe.html?api=http://localhost:4000`.

## Deployment

GitHub Pages serves the `main` branch from the repository root: https://codelady-ship.github.io/net-pro-group-fiqma/.
The old entry page `netprogroup.html` redirects to the root, and GitHub Pages uses `404.html` for unknown URLs.

API: create a free MongoDB Atlas M0 cluster (Network Access `0.0.0.0/0`), then on Render choose *New → Blueprint* and pick this repo. `render.yaml` creates the free web service `net-pro-group-api` from `backend/`; fill `MONGODB_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` (`JWT_SECRET` is generated). Put the Render URL into `NPG_API_URL` in `tools/js/00-config.js`, run `node tools/build-pages.js` (it copies the value to the top of `main.js`), and push to `main`. The free service sleeps after 15 idle minutes; if it does not wake up within 8 s, the form uses `mailto:` instead.

## What I learned

- Turning a fixed-width Figma layout into a fluid, responsive one with Grid and a few breakpoints instead of pixel margins.
- Keeping shared markup consistent across a static multi-page site with a tiny build script.
- Accessible navigation patterns: `aria-expanded`, `aria-current`, skip link, breadcrumbs.
- Handling forms without a backend using a validated `mailto:` flow, and later replacing it with a real API while keeping `mailto:` as the fallback.
- A small lead-management API: statuses, notes, search, a honeypot against bots and an aggregation for dashboard numbers.
- Why file names with spaces or Cyrillic characters cause broken links on the web.
