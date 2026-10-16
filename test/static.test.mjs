import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import astroConfig from '../astro.config.mjs';
import {
  CANONICAL_SLUGS,
  canonicalRoutes,
  forbiddenLocalSlugs,
  sourceHandoffs,
  getCanonicalRoute,
  getBuiltRoutes,
  isCanonicalRoute,
  isBuiltRoute,
  isSourceHandoffUrl,
  classifyDestination,
} from '../src/data/routes.ts';
import {
  base,
  siteUrl,
  routeUrl,
  canonicalUrl,
  routeOutputFile,
  routeHref,
  resolveHref,
  sectionId,
} from '../src/lib/urls.ts';
import { pages, builtPages, tools } from '../src/data/pages.ts';
import { companies, companyGroups } from '../src/data/companies.mjs';
import { search } from '../src/scripts/search.ts';

const expectedCanonicalSlugs = [
  '',
  'stories',
  'stories/learn',
  'stories/recipes',
  'stories/on-the-road',
  'stories/travel',
  'stories/video',
  'rv-types',
  'rv-faq',
  'about-us',
  'our-history',
  'thor-leadership',
  'innovation',
  'operations',
  'global-family-of-companies',
  'european-companies',
  'hymer',
  'supply-companies',
  'airxcel',
  'sustainability',
  'environmental',
  'social-responsibility',
  'governance',
];

const htmlPath = slug => path.join('dist', slug, 'index.html');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const media = JSON.parse(await readFile('src/data/media.json', 'utf8'));

test('Astro configuration and package scripts use approved pins and concurrency at most two', () => {
  assert.equal(astroConfig.site, 'https://rbiren.github.io');
  assert.equal(astroConfig.base, '/thor-industries-redesign/');
  assert.equal(astroConfig.output, 'static');
  assert.equal(astroConfig.trailingSlash, 'always');
  assert.equal(astroConfig.build?.format, 'directory');

  assert.equal(pkg.dependencies.astro, '7.4.0');
  assert.equal(pkg.dependencies.sharp, '0.35.5');
  assert.equal(pkg.devDependencies['@astrojs/check'], '0.9.10');
  assert.equal(pkg.devDependencies.typescript, '6.0.3');
  assert.equal(pkg.scripts.check, 'astro check');
  assert.equal(pkg.scripts.build, 'astro build');
  assert.match(pkg.scripts.test, /^node --test\b/);
  const concurrencyMatch = pkg.scripts.test.match(/--test-concurrency=(\d+)/);
  assert.ok(concurrencyMatch, 'package.json test script must set --test-concurrency');
  assert.ok(Number(concurrencyMatch[1]) <= 2, 'Node test concurrency must be at most 2');
});

test('exact 23-route catalog distinguishes migrated content from original tools and detail URLs', () => {
  assert.equal(canonicalRoutes.length, 23);
  assert.deepEqual([...CANONICAL_SLUGS], expectedCanonicalSlugs);
  assert.deepEqual(canonicalRoutes.map(route => route.slug), expectedCanonicalSlugs);
  assert.equal(new Set(canonicalRoutes.map(route => route.slug)).size, 23);
  assert.equal(new Set(canonicalRoutes.map(route => route.path)).size, 23);
  assert.equal(new Set(canonicalRoutes.map(route => route.sourceUrl)).size, 23);

  for (const slug of expectedCanonicalSlugs) {
    const route = getCanonicalRoute(slug);
    assert.ok(route, `missing canonical route for "${slug}"`);
    assert.equal(isCanonicalRoute(slug), true);
    assert.equal(isCanonicalRoute(route.path), true);
    assert.equal(isCanonicalRoute(route.sourceUrl), true);
    assert.equal(route.sourceUrl, slug ? `https://www.thorindustries.com/${slug}` : 'https://www.thorindustries.com/');
    const classified = classifyDestination(slug);
    assert.equal(classified.kind, 'canonical-route');
  }

  // Original tools, portals, legal pages and detail routes remain source handoffs, not canonical routes
  const handoffSamples = [
    sourceHandoffs.rvFinder,
    sourceHandoffs.dealerLocator,
    sourceHandoffs.investors,
    sourceHandoffs.newsroom,
    sourceHandoffs.careers,
    sourceHandoffs.contact,
    sourceHandoffs.sustainabilityReport,
    sourceHandoffs.supplyManagement,
    sourceHandoffs.terms,
    sourceHandoffs.privacy,
    sourceHandoffs.cookies,
    'https://www.thorindustries.com/stories/learn/checklists-find-rv',
    'https://www.thorindustries.com/rv-types/travel-trailer',
    'https://www.thorindustries.com/thor-companies/airstream',
    'https://www.thorindustries.com/news-events/where-the-magic-happens',
    'https://ir.thorindustries.com/investor-resources/press-releases/default.aspx',
  ];
  for (const url of handoffSamples) {
    assert.equal(isCanonicalRoute(url), false, `handoff URL should not be canonical: ${url}`);
    assert.equal(isSourceHandoffUrl(url), true, `expected source handoff URL: ${url}`);
    assert.equal(classifyDestination(url).kind, 'source-handoff', `expected source-handoff classification for ${url}`);
  }

  // Forbidden legacy/invented local slugs must never be canonical routes
  for (const forbidden of forbiddenLocalSlugs) {
    assert.equal(isCanonicalRoute(forbidden), false, `forbidden slug must not be canonical: ${forbidden}`);
    assert.equal(classifyDestination(forbidden).kind, 'forbidden-local-route', `expected forbidden classification for ${forbidden}`);
  }
});

test('base-safe URL helpers support direct nested-route construction and unbuilt source handoffs', () => {
  assert.equal(base, '/thor-industries-redesign/');
  assert.equal(routeUrl(''), '/thor-industries-redesign/');
  assert.equal(routeUrl('/'), '/thor-industries-redesign/');
  assert.equal(routeUrl('stories'), '/thor-industries-redesign/stories/');
  assert.equal(routeUrl('stories/learn'), '/thor-industries-redesign/stories/learn/');
  assert.equal(routeUrl('/stories/on-the-road/'), '/thor-industries-redesign/stories/on-the-road/');
  assert.equal(siteUrl('media/hero-960.webp'), '/thor-industries-redesign/media/hero-960.webp');
  assert.equal(canonicalUrl(''), 'https://rbiren.github.io/thor-industries-redesign/');
  assert.equal(canonicalUrl('stories/learn'), 'https://rbiren.github.io/thor-industries-redesign/stories/learn/');
  assert.equal(routeOutputFile(''), path.join('dist', 'index.html'));
  assert.equal(routeOutputFile('stories/learn'), path.join('dist', 'stories/learn', 'index.html'));
  assert.equal(sectionId('Who Is THOR?', 0), 'section-0-who-is-thor');

  // Built route (root) resolves locally; unbuilt canonical routes resolve to official THOR source URLs
  assert.equal(isBuiltRoute(''), true);
  assert.equal(routeHref(''), '/thor-industries-redesign/');
  assert.equal(resolveHref('/'), '/thor-industries-redesign/');
  for (const slug of expectedCanonicalSlugs.filter(Boolean)) {
    assert.equal(isBuiltRoute(slug), false, `${slug} must remain unbuilt during foundation/homepage-preview`);
    assert.equal(routeHref(slug), `https://www.thorindustries.com/${slug}`);
    assert.equal(resolveHref(`/${slug}/`), `https://www.thorindustries.com/${slug}`);
    assert.equal(routeHref(slug, { forceLocal: true }), `/thor-industries-redesign/${slug}/`);
  }
});

test('foundation builds only the currently enabled root subset and does not emit the other 22 pages', async () => {
  const builtRoutes = getBuiltRoutes();
  assert.deepEqual(builtRoutes.map(route => route.slug), ['']);
  assert.deepEqual(builtPages.map(page => page.slug), ['']);
  assert.equal(pages.length, 23);

  for (const page of builtPages) {
    const html = await readFile(htmlPath(page.slug), 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, page.slug);
    assert.ok(html.includes(page.title.replaceAll('&', '&amp;')), page.slug);
    assert.ok(page.sections.length > 0);
    assert.ok(html.length > 5000, page.slug);
    assert.ok(!html.includes('403 Forbidden'));
    assert.ok(!/lorem ipsum|coming soon|placeholder/i.test(html.replace(/placeholder="[^"]*"/g, '')));
    assert.ok(html.includes('id="main"'));
    assert.ok(html.includes('<title>'));
    assert.ok(html.includes('rel="canonical"'));
  }

  for (const slug of expectedCanonicalSlugs.filter(Boolean)) {
    await assert.rejects(
      access(htmlPath(slug)),
      `unbuilt canonical route "${slug}" must not be emitted in dist during foundation`,
    );
  }
  for (const forbidden of forbiddenLocalSlugs) {
    await assert.rejects(
      access(htmlPath(forbidden)),
      `forbidden route "${forbidden}" must not exist in dist`,
    );
  }
});

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(name) : [name];
  }))).flat();
}

test('all built HTML internal links, fragments, images and srcsets resolve beneath the project base', async () => {
  const htmlFiles = (await filesIn('dist')).filter(file => file.endsWith('.html'));
  assert.deepEqual(
    htmlFiles.map(file => path.relative('dist', file)).sort(),
    ['404.html', 'index.html'],
  );
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
    assert.equal(ids.size, [...html.matchAll(/\bid="([^"]+)"/g)].length, `${file}: duplicate IDs`);
    const urls = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    urls.push(...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap(match => match[1].split(',').map(item => item.trim().split(/\s+/)[0])));
    for (const url of urls) {
      if (/^https?:\/\//.test(url)) { assert.ok(!url.includes('javascript:'), file); continue; }
      if (url.startsWith('#')) {
        assert.ok(ids.has(url.slice(1)), `${file}: missing ${url}`);
        continue;
      }
      assert.ok(url.startsWith(base), `${file}: unsafe local URL ${url}`);
      const relative = decodeURI(url.slice(base.length).split(/[?#]/)[0]);
      const target = path.join('dist', relative, relative.endsWith('/') || !relative ? 'index.html' : '');
      await access(target).catch(() => assert.fail(`${file}: missing ${target}`));
    }
  }
});

test('search index covers the currently built subset and search ranks body/title/category matches', async () => {
  const index = JSON.parse(await readFile('dist/search-index.json', 'utf8'));
  assert.equal(index.length, builtPages.length);
  assert.equal(new Set(index.map(record => record.url)).size, builtPages.length);
  for (const page of builtPages) {
    const record = index.find(record => record.url === `${base}${page.slug ? page.slug + '/' : ''}`);
    assert.ok(record, page.slug);
    assert.ok(record.body.length > 50, page.slug);
  }
  assert.equal(search(index, 'Find Your RV')[0].title, 'Find Your RV');
  assert.deepEqual(search(index, '<script>alert(1)</script>'), []);
  assert.deepEqual(search(index, 'zzzz-no-match-zzzz'), []);
});

test('source handoff inventory and company directory preserve official THOR destinations', async () => {
  assert.equal(tools.finder, 'https://www.thorindustries.com/find-yours');
  assert.equal(tools.dealerLocator, 'https://www.thorindustries.com/locate-a-dealer');
  assert.equal(tools.investors, 'https://ir.thorindustries.com/');
  assert.equal(tools.newsroom, 'https://www.thorindustries.com/newsroom');
  assert.equal(tools.careers, 'https://www.thorindustries.com/careers');
  const home = await readFile(htmlPath(''), 'utf8');
  assert.ok(home.includes(`href="${tools.finder}"`));
  assert.ok(home.includes(`href="${tools.investors}"`));
  assert.equal(companyGroups.length, 4);
  assert.ok(companies.length >= 45);
  assert.ok(companies.some(company => company.href === 'https://www.thorindustries.com/thor-companies/airstream'));
});

test('all local responsive derivatives decode at their declared srcset widths', async () => {
  for (const [id, asset] of Object.entries(media)) {
    assert.ok(asset.source.startsWith('https://thorindustries-prod.zaneray.com/'));
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    for (const width of asset.widths) {
      const image = await sharp(`public/media/${id}-${width}.webp`).metadata();
      assert.equal(image.width, width, id);
      assert.equal(image.format, 'webp');
    }
  }
});

test('404 is real static content and the deploy workflow uploads only built output', async () => {
  const html = await readFile('dist/404.html', 'utf8');
  assert.ok(html.includes('noindex'));
  assert.ok(html.includes('Page not found'));
  const workflow = await readFile('.github/workflows/pages.yml', 'utf8');
  for (const command of ['npm ci', 'npm run check', 'npm run build', 'npm test', 'path: dist']) assert.ok(workflow.includes(command));
  assert.ok(!workflow.includes('path: .'));
});

