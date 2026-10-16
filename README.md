# THOR Industries homepage concept

A responsive, single-page redesign concept using public THOR Industries website
content and original generated RV photography. The visual direction uses
cinematic full-bleed imagery, restrained typography, generous spacing, and
simple navigation. It is not affiliated with THOR Industries or Tesla.

## Run locally

This is a dependency-free static site. From this directory, run:

```sh
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Deploy to GitHub Pages

The site has no build step. The workflow in
`.github/workflows/pages.yml` publishes the repository root to GitHub Pages
when changes are pushed to `main`. Enable GitHub Pages with **GitHub Actions**
as the build and deployment source in the repository settings.

GitHub Pages for a private repository depends on the account or organization
plan. The repository should remain private unless its owner explicitly chooses
to make it public.

## Content and assets

- Company, brand, RV-type, sustainability, and news references are based on
  publicly visible THOR Industries website content.
- Photography in `assets/` was generated for this concept and contains no
  THOR or Tesla logos.
- Links to brand and corporate pages lead to their public websites.
