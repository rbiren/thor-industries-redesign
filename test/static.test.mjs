import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { pages, tools } from '../src/data/pages.ts';
import { companies, companyGroups } from '../src/data/companies.mjs';
import { search } from '../src/scripts/search.ts';

const base = '/thor-industries-redesign/';
const expected = [
  '', 'stories', 'stories/category/learn', 'stories/category/recipes', 'stories/category/on-the-road',
  'stories/category/travel', 'stories/category/video', 'rv-types', 'financing-your-rv', 'towing-guide',
  'faq', 'innovation', 'history', 'community', 'news-events', 'careers', 'thor-companies', 'sustainability',
  'sustainability-report', 'sustainability-environmental', 'social-responsibility', 'governance', 'supply-management',
];
const htmlPath = slug => path.join('dist', slug, 'index.html');
const index = JSON.parse(await readFile('dist/search-index.json', 'utf8'));
const media = JSON.parse(await readFile('src/data/media.json', 'utf8'));

test('the approved inventory has exactly 23 unique, substantive content pages', async () => {
  assert.deepEqual(pages.map(page => page.slug).sort(), expected.sort());
  assert.equal(new Set(pages.map(page => page.slug)).size, 23);
  for (const page of pages) {
    const html = await readFile(htmlPath(page.slug), 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1, page.slug);
    assert.ok(html.includes(page.title.replaceAll('&', '&amp;')), page.slug);
    assert.ok(page.sections.length > 0);
    assert.ok(html.length > 15000, page.slug);
    assert.ok(!html.includes('403 Forbidden'));
    assert.ok(!/lorem ipsum|coming soon|placeholder/i.test(html.replace(/placeholder="[^"]*"/g, '')));
    assert.ok(html.includes('id="main"'));
    assert.ok(html.includes('<title>'));
    assert.ok(html.includes('rel="canonical"'));
  }
});

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(name) : [name];
  }))).flat();
}

test('all HTML internal links, fragments, images and srcsets resolve beneath the project base', async () => {
  for (const file of (await filesIn('dist')).filter(file => file.endsWith('.html'))) {
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

test('all 23 pages appear once in search and search ranks body/title/category matches', () => {
  assert.equal(index.length, 23);
  assert.equal(new Set(index.map(record => record.url)).size, 23);
  for (const page of pages) {
    const record = index.find(record => record.url === `${base}${page.slug ? page.slug + '/' : ''}`);
    assert.ok(record, page.slug);
    assert.ok(record.body.length > 50, page.slug);
  }
  assert.equal(search(index, 'RV Types')[0].title, 'RV Types');
  assert.equal(search(index, 'careers')[0].title, 'Careers');
  assert.ok(search(index, 'holding tanks').some(record => record.title === 'Frequently Asked Questions'));
  assert.ok(search(index, 'Bürstner').some(record => record.title === 'THOR Family of Companies'));
  assert.deepEqual(search(index, '<script>alert(1)</script>'), []);
  assert.deepEqual(search(index, 'zzzz-no-match-zzzz'), []);
  assert.equal(search(index, '').length, 6);
});

test('finder, calculators, investors and specific detail destinations are exact source handoffs', async () => {
  assert.equal(tools.finder, 'https://www.thorindustries.com/find-my-rv');
  assert.equal(tools.trip, 'https://www.thorindustries.com/trip-calculator');
  assert.equal(tools.finance, 'https://www.thorindustries.com/financing-your-rv');
  assert.equal(tools.investors, 'https://ir.thorindustries.com/ir-home/default.aspx');
  const home = await readFile(htmlPath(''), 'utf8');
  for (const url of [tools.finder, tools.trip, tools.investors]) assert.ok(home.includes(`href="${url}"`));
  const finance = await readFile(htmlPath('financing-your-rv'), 'utf8');
  assert.ok(finance.includes(`href="${tools.finance}"`));
  for (const slug of ['national-forest-hidden-gems', 'checklists-find-rv']) assert.ok(home.includes(`href="https://www.thorindustries.com/stories/${slug}"`));
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
