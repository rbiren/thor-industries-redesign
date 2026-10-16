import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  BASE_PATH,
  CANONICAL_SLUGS,
  builtRoutes,
  canonicalRoutes,
  forbiddenLocalSlugs,
  sourceHandoffs,
} from '../src/data/routes.ts';
import { footerGroups, footerLinks, navigation, socialLinks } from '../src/data/navigation.ts';
import { builtPages, pages } from '../src/data/pages.ts';
import { companies, companyGroups, homeBrands } from '../src/data/companies.mjs';
import { homeRvTypes } from '../src/data/rv-types.mjs';
import { homeBuyingSeason, homeFeaturedStories, homeNewsEvents } from '../src/data/stories.mjs';
import { assetUrl, isExternalHref, navItemHref, resolveHref, routeHref, siteUrl } from '../src/lib/urls.ts';

const expectedSlugs = [
  '',
  'stories',
  'stories/category/learn',
  'stories/category/recipes',
  'stories/category/on-the-road',
  'stories/category/travel',
  'stories/category/video',
  'rv-types',
  'financing-your-rv',
  'towing-guide',
  'faq',
  'innovation',
  'history',
  'community',
  'news-events',
  'careers',
  'thor-companies',
  'sustainability',
  'sustainability-report',
  'sustainability-environmental',
  'social-responsibility',
  'governance',
  'supply-management',
];

async function walkHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walkHtmlFiles(fullPath);
      return entry.name.endsWith('.html') ? [fullPath] : [];
    }),
  );
  return files.flat();
}

test('Astro static config and canonical 23-route catalog match the GitHub Pages contract', async () => {
  const astroConfig = await readFile('astro.config.mjs', 'utf8');
  assert.ok(astroConfig.includes("site: 'https://rbiren.github.io'"));
  assert.ok(astroConfig.includes("base: '/thor-industries-redesign"));
  assert.ok(astroConfig.includes("output: 'static'"));

  assert.equal(CANONICAL_SLUGS.length, 23);
  assert.deepEqual(CANONICAL_SLUGS, expectedSlugs);
  assert.equal(canonicalRoutes.length, 23);
  assert.equal(pages.length, 23);
  assert.deepEqual(pages.map((page) => page.slug), expectedSlugs);

  for (const forbidden of forbiddenLocalSlugs) {
    assert.ok(!CANONICAL_SLUGS.includes(forbidden), `Forbidden local route ${forbidden} must not be canonical`);
  }
});

test('Base-aware URL helpers prefix built routes and hand off unbuilt routes during homepage preview', () => {
  assert.deepEqual(builtRoutes.map((route) => route.slug), ['']);
  assert.deepEqual(builtPages.map((page) => page.slug), ['']);

  assert.equal(siteUrl('/'), '/thor-industries-redesign/');
  assert.equal(siteUrl('/stories/'), '/thor-industries-redesign/stories/');
  assert.equal(assetUrl('/media/hero.webp'), '/thor-industries-redesign/media/hero.webp');
  assert.equal(assetUrl('favicon.svg'), '/thor-industries-redesign/favicon.svg');

  assert.equal(routeHref(''), '/thor-industries-redesign/');
  assert.equal(routeHref('stories'), 'https://www.thorindustries.com/stories');
  assert.equal(routeHref('thor-companies'), 'https://www.thorindustries.com/thor-companies');
  assert.equal(routeHref('sustainability-report'), 'https://www.thorindustries.com/sustainability-report');
  assert.equal(routeHref('supply-management'), 'https://www.thorindustries.com/supply-management');
  assert.equal(resolveHref('/stories/'), 'https://www.thorindustries.com/stories');
  assert.equal(resolveHref('/'), '/thor-industries-redesign/');
  assert.equal(resolveHref(sourceHandoffs.investors), 'https://ir.thorindustries.com/ir-home/default.aspx');
  assert.equal(resolveHref(sourceHandoffs.rvFinder), 'https://www.thorindustries.com/find-my-rv');
  assert.equal(resolveHref(sourceHandoffs.tripCalculator), 'https://www.thorindustries.com/trip-calculator');
});

test('Navigation model exposes primary THOR destinations and honest source handoffs', () => {
  const topLabels = navigation.map((group) => group.label);
  assert.deepEqual(topLabels, [
    'RV Finder',
    'Stories',
    'RV Basics',
    'About THOR',
    'THOR Companies',
    'Sustainability',
    'Investors',
  ]);

  for (const group of [...navigation, ...footerGroups]) {
    if (group.slug || group.href) {
      const resolved = navItemHref(group);
      assert.ok(resolved.startsWith(BASE_PATH) || isExternalHref(resolved));
    }
    for (const item of group.items ?? []) {
      const resolved = navItemHref(item);
      assert.ok(resolved.startsWith(BASE_PATH) || isExternalHref(resolved));
      if (item.slug && item.slug !== '') {
        assert.equal(resolved, `https://www.thorindustries.com/${item.slug}`);
      }
    }
  }

  assert.equal(footerLinks.length, 4);
  assert.equal(socialLinks.length, 5);
  assert.equal(companyGroups.length, 4);
  assert.ok(companies.length >= 45);
  assert.equal(homeBrands.length, 12);
  assert.equal(homeRvTypes.length, 6);
  assert.equal(homeBuyingSeason.length, 2);
  assert.equal(homeFeaturedStories.length, 9);
  assert.equal(homeNewsEvents.length, 9);
});

test('Homepage preview build outputs only / and /404.html and preserves VAL-HOME-001..005 against source baseline', async () => {
  const htmlFiles = (await walkHtmlFiles('dist')).map((file) => path.relative('dist', file)).sort();
  assert.deepEqual(htmlFiles, ['404.html', 'index.html']);

  const baseline = JSON.parse(await readFile('src/data/source-baseline.json', 'utf8'));
  const homeHtml = await readFile('dist/index.html', 'utf8');
  const cssFiles = (await readdir('dist/_astro')).filter((f) => f.endsWith('.css'));
  const cssContent = (await Promise.all(cssFiles.map((f) => readFile(path.join('dist/_astro', f), 'utf8')))).join('\n');

  // VAL-HOME-001: Hero, Find Your RV copy/action, responsive picture, sans-serif typography
  assert.ok(homeHtml.includes(`<h1>${baseline.hero.heading}</h1>`));
  assert.ok(homeHtml.includes(baseline.hero.copy));
  assert.ok(homeHtml.includes(`href="${baseline.hero.actionHref}"`));
  assert.ok(homeHtml.includes('/thor-industries-redesign/media/hero-mobile'));
  assert.ok(homeHtml.includes('/thor-industries-redesign/media/hero-1920.webp'));
  assert.ok(cssContent.includes('Arial') && !cssContent.includes('Georgia') && !cssContent.includes('Times New Roman'));

  // VAL-HOME-002: Who Is THOR? copy, Explore Companies CTA, YouTube Board Video HlXl0gFApyQ
  assert.ok(homeHtml.includes(baseline.whoIsThor.heading));
  assert.ok(homeHtml.includes(baseline.whoIsThor.copy));
  assert.ok(homeHtml.includes(baseline.whoIsThor.videoTitle));
  assert.ok(homeHtml.includes(`data-video-open="${baseline.whoIsThor.youtubeId}"`));
  assert.ok(homeHtml.includes(baseline.whoIsThor.youtubeEmbed));
  assert.ok(homeHtml.includes(`href="${baseline.whoIsThor.youtubeWatch}"`));
  assert.ok(homeHtml.includes('id="video-dialog"'));

  // VAL-HOME-003: Meet the Family of Companies (12 brands with photos, logos, and profile links) & Explore RV Types (6 cards)
  assert.ok(homeHtml.includes(baseline.familyOfCompanies.heading));
  assert.ok(homeHtml.includes(baseline.familyOfCompanies.copy));
  for (const brand of baseline.familyOfCompanies.brands) {
    assert.ok(homeHtml.includes(brand.name), `Missing homepage brand ${brand.name}`);
    assert.ok(homeHtml.includes(`href="${brand.href}"`), `Missing brand profile link ${brand.href}`);
  }
  assert.ok(homeHtml.includes(baseline.rvTypes.heading));
  assert.ok(homeHtml.includes(baseline.rvTypes.copy));
  for (const rvType of baseline.rvTypes.cards) {
    assert.ok(homeHtml.includes(rvType.title), `Missing homepage RV type ${rvType.title}`);
    assert.ok(homeHtml.includes(`href="${rvType.href}"`), `Missing RV type detail link ${rvType.href}`);
  }

  // VAL-HOME-004: Buying Season (2 cards), Featured Stories (9 cards), News and Events (9 cards), Closing CTA
  assert.ok(homeHtml.includes(baseline.buyingSeason.heading));
  for (const card of baseline.buyingSeason.cards) {
    assert.ok(homeHtml.includes(card.eyebrow));
    assert.ok(homeHtml.includes(card.title));
    assert.ok(homeHtml.includes(`href="${card.href}"`));
  }
  assert.ok(homeHtml.includes(baseline.featuredStories.heading));
  for (const story of baseline.featuredStories.cards) {
    assert.ok(homeHtml.includes(story.title), `Missing featured story ${story.title}`);
    assert.ok(homeHtml.includes(`href="${story.href}"`), `Missing featured story link ${story.href}`);
  }
  assert.ok(homeHtml.includes(baseline.newsAndEvents.heading));
  assert.ok(
    homeHtml.includes(baseline.newsAndEvents.subtitle) ||
      homeHtml.includes(baseline.newsAndEvents.subtitle.replaceAll("'", '&#39;')),
  );
  for (const news of baseline.newsAndEvents.cards) {
    assert.ok(homeHtml.includes(news.title), `Missing news item ${news.title}`);
    assert.ok(homeHtml.includes(news.date), `Missing news date ${news.date}`);
    assert.ok(homeHtml.includes(`href="${news.href}"`), `Missing news link ${news.href}`);
  }
  assert.ok(homeHtml.includes(baseline.closingCta.heading));
  assert.ok(homeHtml.includes(baseline.closingCta.copy));
  assert.ok(homeHtml.includes('/thor-industries-redesign/media/finder-cta'));

  // VAL-HOME-005: Base path integrity, non-empty alt attributes, and zero broken local routes
  assert.ok(homeHtml.includes('©2026 THOR Industries, Inc. All Rights Reserved.'));
  assert.ok(homeHtml.includes('aria-expanded="false"'));
  assert.ok(homeHtml.includes('aria-controls="desktop-dropdown-1"'));
  assert.ok(homeHtml.includes('aria-controls="site-search"'));
  assert.ok(homeHtml.includes('aria-controls="mobile-menu"'));
  assert.ok(homeHtml.includes('aria-controls="video-dialog"'));

  for (const htmlFile of htmlFiles) {
    const html = await readFile(path.join('dist', htmlFile), 'utf8');
    const attrs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const value of attrs) {
      if (value.startsWith('#') || value.startsWith('http://') || value.startsWith('https://')) continue;
      assert.ok(
        value.startsWith('/thor-industries-redesign/'),
        `${htmlFile} has non-prefixed root URL: ${value}`,
      );
      const localRel = value.slice('/thor-industries-redesign/'.length).split('#')[0].split('?')[0];
      if (!localRel) {
        assert.ok(existsSync('dist/index.html'));
      } else {
        const candidateFile = path.join('dist', localRel);
        const candidateIndex = path.join('dist', localRel, 'index.html');
        assert.ok(
          existsSync(candidateFile) || existsSync(candidateIndex),
          `Broken local asset or route in ${htmlFile}: ${value}`,
        );
      }
    }

    const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    assert.ok(imgTags.length > 0);
    for (const tag of imgTags) {
      const altMatch = tag.match(/\balt="([^"]*)"/);
      assert.ok(altMatch && altMatch[1].trim().length > 0, `Image missing descriptive alt attribute: ${tag}`);
    }
  }
});

test('All local media derivatives are valid WebP assets with positive dimensions', async () => {
  const media = JSON.parse(await readFile('src/data/media.json', 'utf8'));
  const ids = Object.keys(media);
  assert.ok(ids.length >= 100);
  for (const [id, asset] of Object.entries(media)) {
    assert.ok(asset.source.startsWith('https://thorindustries-prod.zaneray.com/'), `${id} source is not THOR CDN`);
    assert.equal(asset.format, 'webp');
    assert.ok(asset.width > 0 && asset.height > 0);
    assert.ok(Array.isArray(asset.widths) && asset.widths.length > 0);
    for (const width of asset.widths) {
      const file = path.join('public', 'media', `${id}-${width}.webp`);
      const info = await stat(file);
      assert.ok(info.size > 80, `${file} is unexpectedly small`);
      const image = await sharp(file).metadata();
      assert.ok(image.width > 0 && image.width <= width, `${file} width mismatch`);
      assert.ok(image.height > 0, `${file} height mismatch`);
      assert.equal(image.format, 'webp');
    }
  }
});

test('404 is real static content and the deploy workflow uploads only built output', async () => {
  const html = await readFile('dist/404.html', 'utf8');
  assert.ok(html.includes('noindex'));
  assert.ok(html.includes('Page not found'));
  const workflow = await readFile('.github/workflows/pages.yml', 'utf8');
  for (const command of ['npm ci', 'npm run check', 'npm run build', 'npm test', 'path: dist']) {
    assert.ok(workflow.includes(command));
  }
  assert.ok(!workflow.includes('path: .'));
});
