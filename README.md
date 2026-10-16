# THOR Industries — static redesign

A 23-page, independently published THOR redesign with authorized original THOR
copy, photography and logos. Minimalist, image-led layouts; accessible navigation,
local search, and responsive local images. No CMS, backend, database, analytics,
or lead-collection forms. This is not the official THOR Industries website and is
not affiliated with Tesla.

Live: https://rbiren.github.io/thor-industries-redesign/

## Development

Use Node 24 (minimum 22.22.0), and npm 9.6.5 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:4321/thor-industries-redesign/. For a production preview:

```sh
npm run check
npm run build
npm test
npm run preview
```

Tests use Node's built-in test runner and native TypeScript support. They inspect
the built output, so build before testing. No browser dependency is installed.
Use agent-browser or a real browser for responsive, keyboard and visual checks.

## Scope and content

- Home, Stories, five story categories, RV Types, Financing Your RV, Towing
  Guide, FAQ, Innovation, History, Community, News & Events, Careers, THOR
  Companies and six Sustainability pages: exactly 23 content routes.
- Data lives in `src/data/pages.ts`, with shared story, company, FAQ and RV-type
  datasets. Layouts and components live in `src/layouts` and `src/components`.
- Story/category grids feature finite selections of actual THOR stories and link
  to the originals and full source collections. This is not an article archive
  migration. Company profiles, RV-type detail pages, news details, jobs, PDFs,
  the global locations map and newsletter subscription remain source-hosted.
- RV Finder, Trip Calculator, the finance calculator and Investors are explicit
  original-site handoffs. No nonfunctional replica controls are presented.
- Local search indexes the title, description and body of all 23 migrated pages,
  including the complete company directory and FAQ, into `search-index.json`.
  Searches run in the browser and are not sent to a search provider.
- Source copy was captured from the corresponding pages at
  https://www.thorindustries.com/ in October 2026. News dates, source pricing
  references and FY2025 report labels are preserved, not silently modernized.
  Consult the linked original manufacturer/dealer for current product details.
- The site owner confirmed permission to reuse THOR copy, photographs and marks,
  including modification and public publication. This is not a reusable asset
  license for third parties. All trademarks and media remain their owners'.

## Media

`src/data/media-sources.mjs` and `src/data/companies.mjs` contain the finite source
asset URLs. Authorized originals are stored in `src/assets/originals/`; optimized
WebP variants are in `public/media/`. `src/data/media.json` records source URLs,
checksums, decoded format and derivative dimensions. The homepage has a separate,
subject-safe mobile hero crop from THOR's source.

To regenerate assets (not required for a normal build):

```sh
npm run media
```

This uses local originals where present. Missing originals are downloaded only
from the explicit authorized inventory, not by crawling the source website.
It never imports source scripts, tracking code or forms. Normal builds and
deployment need no access to the source CDN.

## GitHub Pages

`astro.config.mjs` sets `site: https://rbiren.github.io`, the project base
`/thor-industries-redesign/`, static output, directory routes and trailing slashes.
All internal navigation and image URLs use the project base. Nested URLs map to
real `index.html` files and can be refreshed directly; there is no SPA fallback.

`.github/workflows/pages.yml` installs locked dependencies, checks types, builds,
runs tests and publishes **dist/** to GitHub Pages on pushes to `main`.
Pages must use **GitHub Actions** as its deployment source. Do not publish the
repository root, node_modules or original media directory as the website.

Package versions are pinned; in particular, @astrojs/check 0.9.10 supports
TypeScript 5/6, so this project pins TypeScript 6.0.3 rather than the incompatible
TypeScript 7 registry latest observed during implementation.
