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

function extractSection(html, sectionId) {
  const marker = `id="${sectionId}"`;
  const idx = html.indexOf(marker);
  assert.ok(idx !== -1, `Missing section #${sectionId}`);
  const start = html.lastIndexOf('<section', idx);
  const end = html.indexOf('</section>', idx);
  assert.ok(start !== -1 && end !== -1, `Malformed section bounds for #${sectionId}`);
  return html.slice(start, end + '</section>'.length);
}

function decodeHtmlEntities(str) {
  return str
    .replaceAll('&amp;', '&')
    .replaceAll('&#38;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"');
}

function parseContentCards(sectionHtml) {
  const articles = [...sectionHtml.matchAll(/<article\b[^>]*class="[^"]*content-card[^"]*"[^>]*>([\s\S]*?)<\/article>/g)];
  return articles.map((match) => {
    const body = match[1];
    const hrefMatch = body.match(/<a\b[^>]*class="card-link"[^>]*href="([^"]+)"/);
    const eyebrowMatch = body.match(/<p\b[^>]*class="eyebrow"[^>]*>([\s\S]*?)<\/p>/);
    const titleMatch = body.match(/<h3>([\s\S]*?)<\/h3>/);
    const textMatch = body.match(/<\/h3>\s*<p>([\s\S]*?)<\/p>/);
    const actionMatch = body.match(/<span\b[^>]*class="text-link"[^>]*>\s*([\s\S]*?)\s*<span\b/);
    return {
      href: hrefMatch ? hrefMatch[1].trim() : '',
      eyebrow: eyebrowMatch ? decodeHtmlEntities(eyebrowMatch[1].trim()) : '',
      title: titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : '',
      text: textMatch ? decodeHtmlEntities(textMatch[1].trim()) : '',
      action: actionMatch ? decodeHtmlEntities(actionMatch[1].trim()) : '',
    };
  });
}

test('Homepage capture-derived regressions verify module/card associations against retained raw source literals', async () => {
  const homeHtml = await readFile('dist/index.html', 'utf8');
  const baseline = JSON.parse(await readFile('src/data/source-baseline.json', 'utf8'));

  // 1. Hero must not include the unsupported "Global Operating Brands" / "40+" statistic
  const heroEnd = homeHtml.indexOf('</section>');
  const heroHtml = homeHtml.slice(0, heroEnd + '</section>'.length);
  assert.ok(heroHtml.includes('class="page-hero home-hero"'));
  assert.ok(!heroHtml.includes('Global Operating Brands'), 'Hero must not include unsupported Global Operating Brands label');
  assert.ok(!heroHtml.includes('40+'), 'Hero must not include unsupported 40+ statistic');
  assert.ok(!homeHtml.includes('Global Operating Brands'));

  // 2. Company & RV-type modules preserve exact captured copy and hub CTA labels within their section headers
  const expectedFamilyIntro =
    'Together, the THOR family of companies represents the world’s largest manufacturer of recreational vehicles. We offer a comprehensive range of RVs and travel tools to inspire and empower everyone to Go Everywhere. Stay Anywhere. We’ve chosen our family wisely so your choice is that much easier.';
  const expectedFamilyCta = 'View Family of Companies';
  const expectedFamilyHref = 'https://www.thorindustries.com/thor-companies';

  const familySection = extractSection(homeHtml, 'family-of-companies');
  assert.ok(familySection.includes('<h2>Meet the Family of Companies</h2>'));
  assert.ok(familySection.includes(`<p>${expectedFamilyIntro}</p>`), 'Family of Companies section missing captured intro copy');
  assert.ok(!familySection.includes('What started with the acquisition of Airstream'), 'Substituted family intro copy must be removed');
  const familyHeaderCta = familySection.match(/<a\b[^>]*class="button dark"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/);
  assert.ok(familyHeaderCta, 'Missing Family of Companies hub CTA');
  assert.equal(familyHeaderCta[1], expectedFamilyHref);
  assert.equal(familyHeaderCta[2].trim(), expectedFamilyCta);

  assert.equal(baseline.familyOfCompanies.copy, expectedFamilyIntro);
  assert.equal(baseline.familyOfCompanies.actionLabel, expectedFamilyCta);
  assert.equal(baseline.familyOfCompanies.actionHref, expectedFamilyHref);

  const expectedRvTypesSubtitle = 'We’ll help you figure out what kind of RV is right for you.';
  const expectedRvTypesCta = 'View All';
  const expectedRvTypesHref = 'https://www.thorindustries.com/rv-types';

  const rvTypesSection = extractSection(homeHtml, 'explore-rv-types');
  assert.ok(rvTypesSection.includes('<h2>Explore RV Types</h2>'));
  assert.ok(rvTypesSection.includes(`<p>${expectedRvTypesSubtitle}</p>`), 'Explore RV Types section missing captured subtitle');
  assert.ok(!rvTypesSection.includes('Searching for your dream RV?'), 'Substituted RV types copy must be removed');
  const rvTypesHeaderCta = rvTypesSection.match(/<a\b[^>]*class="button dark"[^>]*href="([^"]+)"[^>]*>\s*([\s\S]*?)\s*<\/a>/);
  assert.ok(rvTypesHeaderCta, 'Missing Explore RV Types hub CTA');
  assert.equal(rvTypesHeaderCta[1], expectedRvTypesHref);
  assert.equal(rvTypesHeaderCta[2].trim(), expectedRvTypesCta);

  assert.equal(baseline.rvTypes.copy, expectedRvTypesSubtitle);
  assert.equal(baseline.rvTypes.actionLabel, expectedRvTypesCta);
  assert.equal(baseline.rvTypes.actionHref, expectedRvTypesHref);

  // 3. Featured Stories: all 9 card (title, href, action) tuples within #featured-stories match raw capture
  const expectedFeaturedStories = [
    {
      title: 'Three Checklists To Help You Find Your Perfect RV',
      href: 'https://www.thorindustries.com/stories/checklists-find-rv',
      action: 'Read Full Story',
    },
    {
      title: 'Trackside Service: Why Your Next RV Repair Might Be at the Racetrack',
      href: 'https://www.thorindustries.com/stories/thor-complimentary-mobile-service',
      action: 'Read Full Story',
    },
    {
      title: 'Ready to buy an RV?',
      href: 'https://www.thorindustries.com/stories/rv-dealer-conversation',
      action: 'Read Full Story',
    },
    {
      title: '12 Hidden Gems of the National Forest System',
      href: 'https://www.thorindustries.com/stories/national-forest-hidden-gems',
      action: 'Read Full Story',
    },
    {
      title: 'A Tour of Bailey & Nicole Damberg’s KZ Durango Gold Fifth Wheel RV',
      href: 'https://www.thorindustries.com/stories/welcome-to-my-rv-damberg',
      action: 'Read Full Story',
    },
    {
      title: 'Your Guide to Alternative RV Campsites',
      href: 'https://www.thorindustries.com/stories/alternative-campsites-guide',
      action: 'Watch Now',
    },
    {
      title: 'The Magic of the International Balloon Fiesta',
      href: 'https://www.thorindustries.com/stories/rv-tips-international-balloon-fiesta',
      action: 'Watch Now',
    },
    {
      title: 'My Van Life',
      href: 'https://www.thorindustries.com/stories/van-life-kalen-thorien',
      action: 'Watch Now',
    },
    {
      title: 'Must-Have Items for RVing Families',
      href: 'https://www.thorindustries.com/stories/must-have-items-for-rv-families',
      action: 'Read Full Story',
    },
  ];

  const featuredSection = extractSection(homeHtml, 'featured-stories');
  const parsedFeaturedCards = parseContentCards(featuredSection);
  const renderedFeaturedCards = parsedFeaturedCards.map(({ title, href, action }) => ({
    title,
    href,
    action,
  }));
  assert.deepEqual(renderedFeaturedCards, expectedFeaturedStories);
  assert.deepEqual(baseline.featuredStories.cards, expectedFeaturedStories);

  // 3b. My Van Life preserves the exact captured wording "With a a Class B campervan" (Nuxt:1017, DOM:961/1796)
  const expectedMyVanLifeSummary =
    "Thrill-seeker Kalen Thorien feels most at home when she's exploring off the grid in an RV. With a a Class B campervan, she wakes up to new views and adventures, anywhere in the world, no questions asked, all the time — and she wouldn't want it any other way. Find out why van living is her ideal travel method, and get inspired for your own road trip.";
  const myVanLifeCard = parsedFeaturedCards.find((card) => card.title === 'My Van Life');
  assert.ok(myVanLifeCard, 'Missing My Van Life card in #featured-stories');
  assert.equal(myVanLifeCard.text, expectedMyVanLifeSummary);
  assert.ok(myVanLifeCard.text.includes('With a a Class B campervan'));
  assert.ok(!featuredSection.includes('With a Class B campervan'));

  // 4. News and Events: Travel + Leisure card within #news-and-events preserves exact captured URL
  const expectedElectricRvUrl =
    'https://www.travelandleisure.com/trip-ideas/green-travel/electric-rvs-unveiled-winnebago-thor-industries';
  const newsSection = extractSection(homeHtml, 'news-and-events');
  const renderedNewsCards = parseContentCards(newsSection);
  const electricRvCard = renderedNewsCards.find(
    (card) => card.title === 'These New Electric RVs Could Change How We Road Trip',
  );
  assert.ok(electricRvCard, 'Missing Travel + Leisure electric RV card in #news-and-events');
  assert.equal(electricRvCard.eyebrow, 'January 20, 2022');
  assert.equal(electricRvCard.href, expectedElectricRvUrl);
  assert.equal(electricRvCard.action, 'Read More');
  assert.ok(!homeHtml.includes('thor-industries-electric-rv-concepts'));

  const baselineElectricRv = baseline.newsAndEvents.cards.find(
    (card) => card.title === 'These New Electric RVs Could Change How We Road Trip',
  );
  assert.ok(baselineElectricRv);
  assert.equal(baselineElectricRv.href, expectedElectricRvUrl);

  // 4b. Hybrid news card has no uncaptured summary in #news-and-events (Nuxt:1075-1081, DOM:994-996/1902-1905)
  const hybridNewsCard = renderedNewsCards.find(
    (card) => card.title === 'World’s First Hybrid Class A Motorhome',
  );
  assert.ok(hybridNewsCard, 'Missing World’s First Hybrid Class A Motorhome card in #news-and-events');
  assert.equal(hybridNewsCard.eyebrow, 'Hybrid');
  assert.equal(hybridNewsCard.href, 'https://www.thorindustries.com/worlds-first-hybrid-class-a-motorhome');
  assert.equal(hybridNewsCard.action, 'Learn More');
  assert.equal(hybridNewsCard.text, '', 'Hybrid news card must not include an invented summary paragraph');
  assert.ok(
    !homeHtml.includes(
      'Explore how THOR Industries and Harbinger collaborated to develop the world’s first hybrid Class A motorhome.',
    ),
    'Invented hybrid news summary must be absent from rendered homepage',
  );

  // 5. Who Is THOR? uses dedicated local YouTube poster (https://i.ytimg.com/vi/HlXl0gFApyQ/hqdefault.jpg, Nuxt:44-58)
  // while leaving family image intact for legitimate Airstream/company uses (Nuxt:65-72)
  const media = JSON.parse(await readFile('src/data/media.json', 'utf8'));
  const expectedBoardPosterSource = 'https://i.ytimg.com/vi/HlXl0gFApyQ/hqdefault.jpg';
  assert.ok(media['board-video-poster'], 'Missing dedicated board-video-poster key in src/data/media.json');
  assert.equal(media['board-video-poster'].source, expectedBoardPosterSource);
  assert.ok(
    media.family.source.includes('61f150d3-fe9e-4e43-a555-55486f547647__CEM6366+%281%29.jpg'),
    'Existing family asset source URL must remain the Airstream photograph',
  );

  const whoIsThorSection = extractSection(homeHtml, 'who-is-thor');
  assert.ok(
    whoIsThorSection.includes('/thor-industries-redesign/media/board-video-poster-480.webp'),
    'Who Is THOR section must render local board-video-poster WebP asset',
  );
  assert.ok(
    !whoIsThorSection.includes('/thor-industries-redesign/media/family-'),
    'Who Is THOR section must not render the unrelated family/Airstream photo',
  );
  const whoPosterImg = whoIsThorSection.match(/<img\b[^>]*>/);
  assert.ok(whoPosterImg, 'Missing video poster <img> in #who-is-thor');
  const whoPosterAlt = whoPosterImg[0].match(/\balt="([^"]*)"/);
  assert.ok(whoPosterAlt && whoPosterAlt[1].includes('2025 THOR Industries Board Video'));
  assert.ok(!whoPosterAlt[1].includes('Airstream'), 'Video poster alt text must not describe the Airstream photo');
  assert.ok(
    familySection.includes('/thor-industries-redesign/media/family-'),
    'Family of Companies section must retain the legitimate family/Airstream image',
  );

  // 6. Hero image loads eagerly while below-fold section images default to lazy loading
  assert.ok(heroHtml.includes('loading="eager"'));
  assert.ok(featuredSection.includes('loading="lazy"'));
  assert.ok(!featuredSection.includes('loading="eager"'));
  assert.ok(newsSection.includes('loading="lazy"'));
  assert.ok(!newsSection.includes('loading="eager"'));
});

test('All local media derivatives are valid WebP assets with positive dimensions', async () => {
  const media = JSON.parse(await readFile('src/data/media.json', 'utf8'));
  const ids = Object.keys(media);
  assert.ok(ids.length >= 100);
  for (const [id, asset] of Object.entries(media)) {
    assert.ok(
      asset.source.startsWith('https://thorindustries-prod.zaneray.com/') ||
        asset.source === 'https://i.ytimg.com/vi/HlXl0gFApyQ/hqdefault.jpg',
      `${id} source is not an authorized THOR/YouTube capture source`,
    );
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
