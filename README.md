# THOR Industries — Static Redesign

A 23-page, independently published static Astro redesign of the THOR Industries corporate website using authorized original THOR copy, photography, and brand marks. The redesign applies a minimalist, image-led white-and-charcoal sans-serif layout with accessible desktop dropdown and mobile accordion navigation, a client-side 23-page search index, and locally optimized responsive WebP media.

No CMS, backend server, database, authentication, analytics, external search service, paid hosting, or lead-collection forms are used. This is an independent static redesign preview and is not the official THOR Industries operational website or affiliated with Tesla.

Live deployment: https://rbiren.github.io/thor-industries-redesign/

## Environment and Pinned Toolchain

Use **Node 24** (`>=24.0.0`; verified baseline **Node 24.21.0** and **npm 11.19.0**).

`package.json` and the committed `package-lock.json` pin the verified toolchain:

- `astro`: `7.4.0`
- `sharp`: `0.35.5`
- `@astrojs/check`: `0.9.10`
- `typescript`: `6.0.3` (pinned because `@astrojs/check@0.9.10` supports TypeScript 5/6 rather than TypeScript 7)

## Setup, Development, Validation, and Preview

### 1. Clean install

Install exact locked dependencies from `package-lock.json`:

```sh
npm ci
```

### 2. Local development server (`127.0.0.1:4173`)

Local servers bind strictly to loopback (`127.0.0.1`) on ports `4173` (dev) and `4174` (preview):

```sh
npm run dev -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/thor-industries-redesign/`.

### 3. Typecheck, static build, and test gate

Run the validation and build pipeline in order:

```sh
npm run check
npm run build
npm test
```

- `npm run check` runs `astro check` for Astro and TypeScript diagnostics.
- `npm run build` runs `astro build` and outputs the static site to `dist/`.
- `npm test` runs `node --test --test-concurrency=2` using Node's built-in test runner and native TypeScript support (with concurrency capped at `2`). Tests inspect the built files in `dist/`, so always run `npm run build` before `npm test`.

### 4. Production preview server (`127.0.0.1:4174`)

After building `dist/`, serve the production build locally on loopback port `4174`:

```sh
npm run preview -- --host 127.0.0.1 --port 4174
```

Open `http://127.0.0.1:4174/thor-industries-redesign/`.

`astro.config.mjs` sets `server: { host: '127.0.0.1' }` and `package.json` includes `--ignore-lock` in the `dev` and `preview` scripts so local servers bind reliably to `127.0.0.1` without exposing public network interfaces.

## Scope and 23-Page Route Boundary (`C23`)

The static build generates **exactly 23 canonical content routes** (`CANONICAL_SLUGS` in `src/data/routes.ts`), each emitted as a trailing-slash directory (`dist/<slug>/index.html`) under the `/thor-industries-redesign/` project base:

| Group | Count | Local Routes (under `/thor-industries-redesign`) |
| --- | --- | --- |
| Homepage | 1 | `/` |
| Stories | 6 | `/stories/`, `/stories/category/learn/`, `/stories/category/recipes/`, `/stories/category/on-the-road/`, `/stories/category/travel/`, `/stories/category/video/` |
| RV Education | 4 | `/rv-types/`, `/financing-your-rv/`, `/towing-guide/`, `/faq/` |
| Corporate | 6 | `/innovation/`, `/history/`, `/community/`, `/news-events/`, `/careers/`, `/thor-companies/` |
| Sustainability | 6 | `/sustainability/`, `/sustainability-report/`, `/sustainability-environmental/`, `/social-responsibility/`, `/governance/`, `/supply-management/` |

- `About THOR` and `RV Basics` are operable header dropdown triggers, not standalone landing pages.
- `dist/404.html` and `dist/search-index.json` are static infrastructure outputs, not additional migrated content pages.
- Main content and links render as semantic static HTML and remain readable with JavaScript disabled; minimal client-side TypeScript (`src/scripts/interactions.ts` and `src/scripts/search.ts`) powers dropdown/mobile menus, modal dialogs, category/company filtering, FAQ Expand/Collapse All controls, and local search.

## Original-System and Source-Detail Handoffs

Interactive tools and unmigrated detail/archive pages remain explicit handoffs to their authentic THOR destinations (`src/data/routes.ts`):

- **RV Finder:** `https://www.thorindustries.com/find-my-rv`
- **Trip Calculator:** `https://www.thorindustries.com/trip-calculator`
- **Financing Calculator:** `https://www.thorindustries.com/financing-your-rv` (linked from the local `/financing-your-rv/` education page; no fake local payment calculator inputs are rendered)
- **Investors:** `https://ir.thorindustries.com/ir-home/default.aspx`
- **RV Type Details:** Individual type cards on `/` and `/rv-types/` link to their exact source detail pages (`/rv-types/travel-trailer`, `/rv-types/toy-hauler`, `/rv-types/fifth-wheel-shop`, `/rv-types/motorhome-class-a`, `/rv-types/motorhome-class-b`, `/rv-types/class-c-motorhome`, and `/rv-types/lightweight-camper`).
- **Global Companies & Careers:** `/thor-companies/` presents all 50 global THOR operating companies across four groups (*North American RV Manufacturers*, *Other North American Companies*, *European Caravan Manufacturers*, and *Other European Companies*) linking to their captured `/thor-companies/<slug>` or brand destinations. `/careers/` links directly to company recruiting pages and THOR's ADP career portal without fake local job forms.
- **Stories, News & Sustainability Reports:** Story cards link to their individual `https://www.thorindustries.com/stories/<slug>` articles. `/news-events/` links external press/publication items directly to their source URLs and provides a contextual modal preview with a source-page handoff for modal-only releases. `/sustainability-report/` preserves the current `FY2025 Sustainability Report` and all eight archived reports (`2018`–`2024`) with their exact source PDF URLs. Footer social, contact, legal, privacy, cookie, and accessibility links preserve their captured source URLs.

## Content, Search, and Local Media Architecture

- **Data and Routing (`src/data/`, `src/lib/urls.ts`):**
  - `src/data/routes.ts` and `src/lib/urls.ts` centralize the 23-route catalog, external handoffs, and base-prefixed URL helpers (`siteUrl`, `routeHref`, `resolveHref`, `assetUrl`, `navItemHref`).
  - `src/data/navigation.ts` defines the primary header dropdown architecture, footer explore links, 5 social channels, and 7 legal/utility links.
  - `src/data/source-baseline.json`, `src/data/pages.ts`, `src/data/stories.mjs`, `src/data/rv-types.mjs`, `src/data/faq.mjs`, `src/data/corporate.mjs`, `src/data/companies.mjs`, and `src/data/sustainability.mjs` hold the captured source copy, dates, metadata, and link associations.
- **Local Search (`src/data/search-index-data.ts`, `src/pages/search-index.json.ts`, `src/scripts/search.ts`):**
  - Prerenders `dist/search-index.json` (plus an inline JSON fallback in the shared header) with exactly 23 records—one per canonical C23 route—indexing titles, descriptions, section headings, and page body copy.
  - Supports case/whitespace-insensitive matching, empty/no-results/clear states, Escape/close focus return, and safe text-only DOM rendering (`textContent`/`createElement`).
- **Authorized Local Media (`src/data/media-sources.mjs`, `src/data/media.json`, `scripts/media.mjs`):**
  - Original THOR photographs, brand logos, and report covers are cached in `src/assets/originals/`, and responsive WebP derivatives (`240w`–`1920w`) are committed in `public/media/`.
  - Rendered pages load all photography and marks locally from `/thor-industries-redesign/media/...` with zero runtime dependency on THOR's image CDN.
  - To regenerate WebP derivatives from cached originals (not required during normal builds or CI):
    ```sh
    npm run media
    ```

## Base Path and GitHub Pages Deployment

`astro.config.mjs` enforces the GitHub Pages deployment contract:

- `site: 'https://rbiren.github.io'`
- `base: '/thor-industries-redesign/'`
- `output: 'static'`
- `trailingSlash: 'always'`
- `build: { format: 'directory' }`
- `server: { host: '127.0.0.1' }`

Each built route maps to `dist/<slug>/index.html` (and is served at `/thor-industries-redesign/<slug>/`), so direct URL entry and browser refresh work for all 23 routes without SPA fallback rewrites.

`.github/workflows/pages.yml` deploys the site to GitHub Pages on pushes to `main` (or manual `workflow_dispatch`):

1. Checks out the repository (`actions/checkout@v4`).
2. Configures **Node 24** with npm cache (`actions/setup-node@v4`).
3. Runs `npm ci`, `npm run check`, `npm run build`, and `npm test` in order.
4. Configures GitHub Pages (`actions/configure-pages@v5`) and uploads **`dist`** (`path: dist`, never the repository root `.` or a doubly nested project folder) via `actions/upload-pages-artifact@v3`.
5. Publishes the artifact to the `github-pages` environment (`actions/deploy-pages@v4`) using the repository's existing `pages: write` and `id-token: write` permissions.
