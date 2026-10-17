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
import {
  companies,
  companyGlobalOverview,
  companyGroups,
  companyStats,
  homeBrands,
} from '../src/data/companies.mjs';
import {
  careersData,
  communityData,
  historyData,
  innovationData,
  newsEventsData,
  thorCompaniesData,
} from '../src/data/corporate.mjs';
import {
  governanceData,
  socialResponsibilityData,
  supplyManagementData,
  sustainabilityEnvironmentalData,
  sustainabilityHubData,
  sustainabilityNav,
  sustainabilityReportData,
} from '../src/data/sustainability.mjs';
import { homeRvTypes, rvTypes, rvTypesClosingCallouts } from '../src/data/rv-types.mjs';
import {
  categories,
  faqRelatedStories,
  homeBuyingSeason,
  homeFeaturedStories,
  homeNewsEvents,
  storiesHubCategories,
  storyCategoryPages,
  travelRegions,
} from '../src/data/stories.mjs';
import { questions } from '../src/data/faq.mjs';
import { searchRecords } from '../src/data/search-index-data.ts';
import { normalize, search } from '../src/scripts/search.ts';
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

const expectedBuiltSlugs = [
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

test('Base-aware URL helpers prefix built routes and hand off unbuilt routes cleanly', () => {
  assert.deepEqual(
    builtRoutes.map((route) => route.slug),
    expectedBuiltSlugs,
  );
  assert.deepEqual(
    builtPages.map((page) => page.slug),
    expectedBuiltSlugs,
  );

  assert.equal(siteUrl('/'), '/thor-industries-redesign/');
  assert.equal(siteUrl('/stories/'), '/thor-industries-redesign/stories/');
  assert.equal(assetUrl('/media/hero.webp'), '/thor-industries-redesign/media/hero.webp');
  assert.equal(assetUrl('favicon.svg'), '/thor-industries-redesign/favicon.svg');

  assert.equal(routeHref(''), '/thor-industries-redesign/');
  assert.equal(routeHref('stories'), '/thor-industries-redesign/stories/');
  assert.equal(routeHref('stories/category/learn'), '/thor-industries-redesign/stories/category/learn/');
  assert.equal(routeHref('rv-types'), '/thor-industries-redesign/rv-types/');
  assert.equal(routeHref('financing-your-rv'), '/thor-industries-redesign/financing-your-rv/');
  assert.equal(routeHref('towing-guide'), '/thor-industries-redesign/towing-guide/');
  assert.equal(routeHref('faq'), '/thor-industries-redesign/faq/');
  assert.equal(routeHref('innovation'), '/thor-industries-redesign/innovation/');
  assert.equal(routeHref('history'), '/thor-industries-redesign/history/');
  assert.equal(routeHref('community'), '/thor-industries-redesign/community/');
  assert.equal(routeHref('news-events'), '/thor-industries-redesign/news-events/');
  assert.equal(routeHref('careers'), '/thor-industries-redesign/careers/');
  assert.equal(routeHref('thor-companies'), '/thor-industries-redesign/thor-companies/');
  assert.equal(routeHref('sustainability'), '/thor-industries-redesign/sustainability/');
  assert.equal(routeHref('sustainability-report'), '/thor-industries-redesign/sustainability-report/');
  assert.equal(routeHref('sustainability-environmental'), '/thor-industries-redesign/sustainability-environmental/');
  assert.equal(routeHref('social-responsibility'), '/thor-industries-redesign/social-responsibility/');
  assert.equal(routeHref('governance'), '/thor-industries-redesign/governance/');
  assert.equal(routeHref('supply-management'), '/thor-industries-redesign/supply-management/');
  assert.equal(resolveHref('/stories/'), '/thor-industries-redesign/stories/');
  assert.equal(resolveHref('/rv-types/'), '/thor-industries-redesign/rv-types/');
  assert.equal(resolveHref('/thor-companies/'), '/thor-industries-redesign/thor-companies/');
  assert.equal(resolveHref('/news-events/'), '/thor-industries-redesign/news-events/');
  assert.equal(resolveHref('/'), '/thor-industries-redesign/');
  assert.equal(resolveHref(sourceHandoffs.investors), 'https://ir.thorindustries.com/ir-home/default.aspx');
  assert.equal(resolveHref(sourceHandoffs.rvFinder), 'https://www.thorindustries.com/find-my-rv');
  assert.equal(resolveHref(sourceHandoffs.tripCalculator), 'https://www.thorindustries.com/trip-calculator');
});

test('Navigation model exposes primary THOR destinations and routes built Stories/RV Education/Corporate pages locally', () => {
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

  const builtSet = new Set(expectedBuiltSlugs);
  for (const group of [...navigation, ...footerGroups]) {
    if (group.slug !== undefined || group.href) {
      const resolved = navItemHref(group);
      assert.ok(resolved.startsWith(BASE_PATH) || isExternalHref(resolved));
      if (group.slug !== undefined && builtSet.has(group.slug)) {
        assert.equal(resolved, siteUrl(group.slug ? `/${group.slug}/` : '/'));
      }
    }
    for (const item of group.items ?? []) {
      const resolved = navItemHref(item);
      assert.ok(resolved.startsWith(BASE_PATH) || isExternalHref(resolved));
      if (item.slug !== undefined) {
        if (builtSet.has(item.slug)) {
          assert.equal(resolved, siteUrl(item.slug ? `/${item.slug}/` : '/'));
        } else {
          assert.equal(resolved, `https://www.thorindustries.com/${item.slug}`);
        }
      }
    }
  }

  assert.equal(footerLinks.length, 7);
  assert.equal(socialLinks.length, 5);
  assert.equal(companyGroups.length, 4);
  assert.equal(companies.length, 50);
  assert.equal(homeBrands.length, 12);
  assert.equal(homeRvTypes.length, 6);
  assert.equal(homeBuyingSeason.length, 2);
  assert.equal(homeFeaturedStories.length, 9);
  assert.equal(homeNewsEvents.length, 9);
});

test('Static build outputs all 23 built routes plus 404.html and preserves VAL-HOME-001..005 against source baseline', async () => {
  const htmlFiles = (await walkHtmlFiles('dist')).map((file) => path.relative('dist', file)).sort();
  assert.deepEqual(htmlFiles, [
    '404.html',
    'careers/index.html',
    'community/index.html',
    'faq/index.html',
    'financing-your-rv/index.html',
    'governance/index.html',
    'history/index.html',
    'index.html',
    'innovation/index.html',
    'news-events/index.html',
    'rv-types/index.html',
    'social-responsibility/index.html',
    'stories/category/learn/index.html',
    'stories/category/on-the-road/index.html',
    'stories/category/recipes/index.html',
    'stories/category/travel/index.html',
    'stories/category/video/index.html',
    'stories/index.html',
    'supply-management/index.html',
    'sustainability-environmental/index.html',
    'sustainability-report/index.html',
    'sustainability/index.html',
    'thor-companies/index.html',
    'towing-guide/index.html',
  ]);

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
  const expectedFamilyHref = '/thor-industries-redesign/thor-companies/';

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
  const expectedRvTypesHref = '/thor-industries-redesign/rv-types/';

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

test('Stories hub and five category pages satisfy VAL-STORY-001, VAL-STORY-002, and VAL-STORY-003', async () => {
  const hubHtml = await readFile('dist/stories/index.html', 'utf8');
  assert.ok(hubHtml.includes('<h1>STORIES</h1>'));

  // Subnavigation links to all 6 local Stories routes
  assert.ok(hubHtml.includes(`href="${siteUrl('/stories/')}"`));
  for (const cat of categories) {
    const expectedHref = siteUrl(`/stories/category/${cat.slug}/`);
    assert.ok(
      hubHtml.includes(`href="${expectedHref}"`),
      `Stories hub missing category subnav link ${expectedHref}`,
    );
  }

  // Top featured stories section on /stories/
  const topFeaturedSection = extractSection(hubHtml, 'stories-featured');
  const topCards = parseContentCards(topFeaturedSection);
  assert.equal(topCards.length, 4);
  assert.deepEqual(
    topCards.map((c) => c.href),
    [
      'https://www.thorindustries.com/stories/self-care-in-nature',
      'https://www.thorindustries.com/stories/rv-camping-guide',
      'https://www.thorindustries.com/stories/camping-way-of-life',
      'https://www.thorindustries.com/stories/how-to-public-land-camp',
    ],
  );

  // Five category preview sections on /stories/
  assert.equal(storiesHubCategories.length, 5);
  for (const block of storiesHubCategories) {
    const section = extractSection(hubHtml, `stories-hub-${block.category}`);
    assert.ok(section.includes(`<h2>${block.title}</h2>`));
    assert.ok(section.includes(`href="${siteUrl(`/${block.slug}/`)}"`));
    const cards = parseContentCards(section);
    assert.equal(cards.length, 4, `Expected 4 landing stories in ${block.title}`);
    assert.deepEqual(
      cards.map((c) => c.title),
      block.stories.map((s) => s.title),
    );
    assert.deepEqual(
      cards.map((c) => c.href),
      block.stories.map((s) => s.href),
    );
  }

  // Closing CTA on /stories/
  assert.ok(hubHtml.includes('<h2>FIND YOUR PERFECT RV</h2>'));
  assert.ok(hubHtml.includes('href="https://www.thorindustries.com/find-my-rv"'));

  // Category routes: distinct story sets, filter controls, and exact source URLs
  const expectedCounts = {
    learn: 23,
    recipes: 19,
    'on-the-road': 23,
    travel: 24,
    video: 23,
  };
  const signatureSets = new Map();

  for (const [key, expectedCount] of Object.entries(expectedCounts)) {
    const catData = storyCategoryPages[key];
    assert.ok(catData, `Missing storyCategoryPages.${key}`);
    const catHtml = await readFile(path.join('dist', catData.slug, 'index.html'), 'utf8');
    assert.ok(catHtml.includes(`<h1>${catData.heading}</h1>`));

    const listingSection = extractSection(catHtml, 'category-stories');
    const renderedCards = parseContentCards(listingSection);
    assert.equal(renderedCards.length, expectedCount, `${catData.slug} expected ${expectedCount} story cards`);
    assert.deepEqual(
      renderedCards.map((c) => c.title),
      catData.stories.map((s) => s.title),
    );
    assert.deepEqual(
      renderedCards.map((c) => c.href),
      catData.stories.map((s) => s.href),
    );

    assert.deepEqual(
      renderedCards.map((c) => c.action),
      catData.stories.map((s) => s.action),
    );

    for (const card of renderedCards) {
      assert.ok(
        card.href.startsWith('https://www.thorindustries.com/stories/'),
        `Story card ${card.title} must link to original THOR story URL, got ${card.href}`,
      );
      assert.ok(
        ['Read More', 'READ MORE', 'Read Full Story', 'Get Recipe', 'Watch Now', 'WATCH NOW'].includes(
          card.action,
        ),
        `Unexpected story CTA label: ${card.action}`,
      );
    }

    const sig = renderedCards.map((c) => c.href).join('|');
    for (const [otherKey, otherSig] of signatureSets.entries()) {
      assert.notEqual(sig, otherSig, `Category ${key} must not reuse story list from ${otherKey}`);
    }
    signatureSets.set(key, sig);

    // Filter UI assertions
    if (catData.filterGroups && catData.filterGroups.length > 0) {
      for (const group of catData.filterGroups) {
        for (const opt of group.options) {
          assert.ok(
            listingSection.includes(`data-tag-filter="${opt}"`),
            `Missing filter option ${opt} on ${catData.slug}`,
          );
        }
      }
    }
    if (catData.hasLoadMore) {
      assert.ok(listingSection.includes('LOAD MORE STORIES'));
    }
  }

  // Travel category region selector and featured guides
  const travelHtml = await readFile('dist/stories/category/travel/index.html', 'utf8');
  assert.ok(travelHtml.includes('WHICH REGION WOULD YOU LIKE TO VISIT?'));
  assert.ok(travelHtml.includes('VIEW ALL TRIP GUIDES'));
  assert.equal(travelRegions.length, 8);
  for (const region of travelRegions) {
    assert.ok(travelHtml.includes(`data-region-filter="${region.name}"`));
    assert.ok(travelHtml.includes(region.description));
  }
  const featuredGuidesSection = extractSection(travelHtml, 'travel-featured-guides');
  const featuredGuideCards = parseContentCards(featuredGuidesSection);
  assert.equal(featuredGuideCards.length, 3);
  assert.deepEqual(
    featuredGuideCards.map((c) => c.href),
    [
      'https://www.thorindustries.com/stories/rving-natures-playground',
      'https://www.thorindustries.com/stories/first-time-tailgating-rv',
      'https://www.thorindustries.com/stories/first-rv-national-forest-trip',
    ],
  );
});

test('RV Education routes (/rv-types/, /financing-your-rv/, /towing-guide/, /faq/) satisfy VAL-RV-001..004', async () => {
  // VAL-RV-001: /rv-types/
  const rvTypesHtml = await readFile('dist/rv-types/index.html', 'utf8');
  assert.ok(rvTypesHtml.includes('<h1>RV TYPES</h1>'));
  assert.ok(rvTypesHtml.includes('<h2>TOWABLE RVS</h2>'));
  assert.ok(rvTypesHtml.includes('<h2>MOTORIZED RVS</h2>'));
  assert.equal(rvTypes.length, 7);

  const expectedRvTypeUrls = {
    'Travel Trailers': 'https://www.thorindustries.com/rv-types/travel-trailer',
    'Fifth Wheels': 'https://www.thorindustries.com/rv-types/fifth-wheel-shop',
    'Lightweight RVs': 'https://www.thorindustries.com/rv-types/lightweight-camper',
    'Toy Haulers': 'https://www.thorindustries.com/rv-types/toy-hauler',
    'Class A': 'https://www.thorindustries.com/rv-types/motorhome-class-a',
    'Class B': 'https://www.thorindustries.com/rv-types/motorhome-class-b',
    'Class C': 'https://www.thorindustries.com/rv-types/class-c-motorhome',
  };

  for (const item of rvTypes) {
    assert.ok(rvTypesHtml.includes(`<h3>${item.title}</h3>`), `Missing RV type heading ${item.title}`);
    assert.ok(rvTypesHtml.includes(item.text), `Missing RV type description for ${item.title}`);
    assert.equal(item.href, expectedRvTypeUrls[item.title]);
    assert.ok(rvTypesHtml.includes(`href="${item.href}"`), `Missing RV type detail URL ${item.href}`);
    for (const bullet of item.features) {
      assert.ok(rvTypesHtml.includes(`<li>${bullet}</li>`), `Missing RV type feature bullet: ${bullet}`);
    }
  }
  assert.equal(rvTypesClosingCallouts.length, 3);
  for (const callout of rvTypesClosingCallouts) {
    assert.ok(rvTypesHtml.includes(callout.title));
    assert.ok(rvTypesHtml.includes(`href="${callout.href}"`));
  }

  // VAL-RV-002: /financing-your-rv/
  const financingHtml = await readFile('dist/financing-your-rv/index.html', 'utf8');
  assert.ok(financingHtml.includes('<h1>FINANCING YOUR RV</h1>'));
  assert.ok(
    financingHtml.includes("It's More Affordable Than You Think") ||
      financingHtml.includes('It&#39;s More Affordable Than You Think'),
  );
  assert.ok(financingHtml.includes('Few things to keep in mind:'));
  assert.ok(financingHtml.includes('Trade-in Value'));
  assert.ok(financingHtml.includes('Collateral'));
  assert.ok(financingHtml.includes('HOW MUCH DOES IT REALLY COST?'));
  assert.ok(financingHtml.includes('Payment Calculator Disclaimer'));
  assert.ok(financingHtml.includes('href="https://www.thorindustries.com/financing-your-rv"'));
  assert.ok(financingHtml.includes('href="https://www.thorindustries.com/find-my-rv"'));
  const mainFinancing = financingHtml.slice(
    financingHtml.indexOf('<main'),
    financingHtml.indexOf('</main>'),
  );
  assert.ok(
    !/<(?:input|select|textarea)\b/i.test(mainFinancing),
    'Financing page <main> must not contain fake local calculator form inputs',
  );

  // VAL-RV-003: /towing-guide/
  const towingHtml = await readFile('dist/towing-guide/index.html', 'utf8');
  assert.ok(towingHtml.includes('<h1>GUIDE TO TOWING</h1>'));
  assert.ok(towingHtml.includes('MATCH YOUR TOW VEHICLE TO YOUR RV'));
  assert.ok(
    towingHtml.includes('href="https://rvsafety.com/?utm_source=thorindustries.com&amp;utm_medium=referral"') ||
      towingHtml.includes('href="https://rvsafety.com/?utm_source=thorindustries.com&utm_medium=referral"'),
  );
  assert.ok(
    towingHtml.includes(
      'href="https://rvacademy.com/my-class/understanding-truck-towing-guides/understanding-truck-towing-guides?utm_source=thorindustries.com&amp;utm_medium=referral"',
    ) ||
      towingHtml.includes(
        'href="https://rvacademy.com/my-class/understanding-truck-towing-guides/understanding-truck-towing-guides?utm_source=thorindustries.com&utm_medium=referral"',
      ),
  );
  assert.ok(towingHtml.includes('TRAILER LIFE TOWING GUIDE'));
  assert.ok(
    towingHtml.includes(
      'href="https://webcontent.goodsam.com/trailerlife.com/digital_editions/TrailerLifeTowGuide2020.pdf"',
    ),
  );
  assert.ok(towingHtml.includes('FIND YOUR PERFECT TOWABLE RV'));

  // VAL-RV-004: /faq/
  const faqHtml = await readFile('dist/faq/index.html', 'utf8');
  assert.ok(faqHtml.includes('<h1>FREQUENTLY ASKED QUESTIONS</h1>'));
  assert.equal(questions.length, 20);
  const detailsMatches = [...faqHtml.matchAll(/<details\b[^>]*class="faq-item"[^>]*>/g)];
  assert.equal(detailsMatches.length, 20, 'Expected 20 <details class="faq-item"> disclosures on /faq/');
  for (const { title: q, text: a } of questions) {
    assert.ok(
      faqHtml.includes(`<summary>${q}</summary>`) ||
        faqHtml.includes(`<summary>${q.replaceAll("'", '&#39;')}</summary>`),
      `Missing FAQ question: ${q}`,
    );
    for (const para of a) {
      const snippet = para.slice(0, 35);
      assert.ok(
        faqHtml.includes(snippet) || faqHtml.includes(snippet.replaceAll("'", '&#39;')),
        `Missing FAQ answer text starting with: ${snippet}`,
      );
    }
  }
  assert.ok(faqHtml.includes('href="/thor-industries-redesign/towing-guide/"'));
  assert.ok(faqHtml.includes('href="/thor-industries-redesign/rv-types/"'));
  assert.ok(faqHtml.includes('data-faq-expand-all'));
  assert.ok(faqHtml.includes('data-faq-collapse-all'));
  assert.ok(faqHtml.includes('LEARN FROM THEIR EXPERIENCES'));
  const faqRelatedSection = extractSection(faqHtml, 'faq-related-stories');
  const faqCards = parseContentCards(faqRelatedSection);
  assert.equal(faqCards.length, 3);
  assert.deepEqual(
    faqCards.map((c) => c.href),
    faqRelatedStories.map((s) => s.href),
  );
});

test('Corporate routes (/innovation/, /history/, /community/, /news-events/, /careers/) and /thor-companies/ satisfy VAL-CORP-001, VAL-CORP-002, and VAL-CORP-003', async () => {
  // VAL-CORP-001: /innovation/, /history/, /community/
  const innovationHtml = await readFile('dist/innovation/index.html', 'utf8');
  assert.ok(innovationHtml.includes(`<h1>${innovationData.hero.title}</h1>`));
  assert.ok(innovationHtml.includes(innovationData.hero.subtitle));
  for (const para of innovationData.intro.paragraphs) {
    assert.ok(
      innovationHtml.includes(para) || innovationHtml.includes(para.replaceAll("'", '&#39;')),
      `Missing innovation intro paragraph: ${para.slice(0, 40)}`,
    );
  }
  for (const callout of innovationData.callouts) {
    assert.ok(innovationHtml.includes(`<h2>${callout.title}</h2>`));
    for (const para of callout.paragraphs ?? []) {
      assert.ok(
        innovationHtml.includes(para) || innovationHtml.includes(para.replaceAll("'", '&#39;')),
      );
    }
    for (const bullet of callout.bullets ?? []) {
      assert.ok(innovationHtml.includes(`<li>${bullet}</li>`));
    }
  }
  assert.ok(innovationHtml.includes(innovationData.pillarsBanner.title));
  for (const pillar of innovationData.pillarsBanner.pillars) {
    assert.ok(innovationHtml.includes(`<h3>${pillar.name}</h3>`));
    assert.ok(innovationHtml.includes(pillar.description));
  }
  assert.ok(innovationHtml.includes(innovationData.newsBanner.title));
  assert.ok(innovationHtml.includes(`href="${innovationData.newsBanner.action[1]}"`));
  assert.ok(innovationHtml.includes('href="/thor-industries-redesign/news-events/"'));
  assert.ok(innovationHtml.includes(`href="${innovationData.moreCallouts[0].action[1]}"`));
  assert.ok(innovationHtml.includes(`href="${innovationData.spotlightCallout.action[1]}"`));
  assert.ok(innovationHtml.includes(`href="${innovationData.labBanner.action[1]}"`));
  assert.ok(innovationHtml.includes(innovationData.signup.title));

  const historyHtml = await readFile('dist/history/index.html', 'utf8');
  assert.ok(historyHtml.includes(`<h1>${historyData.hero.title}</h1>`));
  for (const para of historyData.intro.paragraphs) {
    assert.ok(
      historyHtml.includes(para) || historyHtml.includes(para.replaceAll("'", '&#39;')),
      `Missing history intro paragraph: ${para.slice(0, 40)}`,
    );
  }
  assert.equal(historyData.timeline.length, 27);
  const milestoneMatches = [...historyHtml.matchAll(/<li\b[^>]*class="history-milestone"[^>]*>/g)];
  assert.equal(milestoneMatches.length, 27, 'Expected 27 chronological milestones on /history/');
  for (const item of historyData.timeline) {
    assert.ok(historyHtml.includes(`<span class="milestone-year">${item.year}</span>`));
    const escapedTitle = item.title.replaceAll('&', '&amp;').replaceAll("'", '&#39;');
    assert.ok(
      historyHtml.includes(`<h3>${item.title}</h3>`) ||
        historyHtml.includes(`<h3>${escapedTitle}</h3>`),
      `Missing history milestone title: ${item.title}`,
    );
    const snippet = item.text.slice(0, 36);
    assert.ok(
      historyHtml.includes(snippet) || historyHtml.includes(snippet.replaceAll("'", '&#39;')),
      `Missing history milestone text for ${item.year} ${item.title}`,
    );
  }

  const communityHtml = await readFile('dist/community/index.html', 'utf8');
  assert.ok(communityHtml.includes(`<h1>${communityData.hero.title}</h1>`));
  assert.ok(communityHtml.includes(communityData.hero.subtitle));
  for (const para of communityData.intro.paragraphs) {
    assert.ok(
      communityHtml.includes(para) || communityHtml.includes(para.replaceAll("'", '&#39;')),
    );
  }
  assert.ok(communityHtml.includes('<h2>LEAP PROGRAM</h2>'));
  assert.ok(communityHtml.includes('href="https://www.thorindustries.com/leap"'));
  assert.ok(communityHtml.includes('<h2>COMMUNITY INVOLVEMENT</h2>'));
  assert.ok(communityHtml.includes('href="https://www.unitedway.org/"'));
  assert.ok(communityHtml.includes('href="https://www.habitat.org/"'));

  // VAL-CORP-002: /news-events/ and /careers/
  const newsHtml = await readFile('dist/news-events/index.html', 'utf8');
  assert.ok(newsHtml.includes(`<h1>${newsEventsData.hero.title}</h1>`));
  assert.equal(newsEventsData.items.length, 15);
  const newsCardMatches = [...newsHtml.matchAll(/<article\b[^>]*class="news-archive-card"[^>]*>/g)];
  assert.equal(newsCardMatches.length, 15, 'Expected 15 news & events items on /news-events/');
  for (const item of newsEventsData.items) {
    assert.ok(newsHtml.includes(item.date), `Missing news date ${item.date}`);
    assert.ok(
      newsHtml.includes(item.title) || newsHtml.includes(item.title.replaceAll("'", '&#39;')),
      `Missing news title ${item.title}`,
    );
    assert.ok(newsHtml.includes(`href="${item.href}"`), `Missing news href ${item.href}`);
  }
  assert.ok(newsHtml.includes('id="news-preview-dialog"'));
  assert.ok(newsHtml.includes('data-news-open'));

  const careersHtml = await readFile('dist/careers/index.html', 'utf8');
  assert.ok(careersHtml.includes(`<h1>${careersData.hero.title}</h1>`));
  assert.ok(careersHtml.includes(careersData.hero.subtitle));
  for (const bullet of careersData.intro.bullets) {
    assert.ok(careersHtml.includes(`<li>${bullet}</li>`));
  }
  assert.ok(careersHtml.includes(careersData.globalHqCallout.title));
  assert.ok(careersHtml.includes(`href="${careersData.globalHqCallout.action[1]}"`));
  assert.ok(careersHtml.includes(`href="${careersData.familySection.transparencyLink.href}"`));
  assert.equal(careersData.familySection.companies.length, 7);
  for (const company of careersData.familySection.companies) {
    assert.ok(careersHtml.includes(`<h3>${company.name}</h3>`));
    const escapedHref = company.href.replaceAll('&', '&amp;');
    assert.ok(
      careersHtml.includes(`href="${company.href}"`) || careersHtml.includes(`href="${escapedHref}"`),
      `Missing recruiting link for ${company.name}: ${company.href}`,
    );
  }
  const mainCareers = careersHtml.slice(careersHtml.indexOf('<main'), careersHtml.indexOf('</main>'));
  assert.ok(
    !/<(?:input|select|textarea)\b/i.test(mainCareers),
    'Careers page <main> must not contain fake local job application form inputs',
  );

  // VAL-CORP-003: /thor-companies/
  const companiesHtml = await readFile('dist/thor-companies/index.html', 'utf8');
  assert.ok(companiesHtml.includes(`<h1>${thorCompaniesData.hero.title}</h1>`));
  assert.deepEqual(companyGroups, [
    'North American RV Manufacturers',
    'Other North American Companies',
    'European Caravan Manufacturers',
    'Other European Companies',
  ]);
  for (const group of companyGroups) {
    assert.ok(companiesHtml.includes(`<h2>${group}</h2>`), `Missing company group heading ${group}`);
  }
  const companyCardMatches = [...companiesHtml.matchAll(/<article\b[^>]*class="company-profile-card"[^>]*>/g)];
  assert.equal(companyCardMatches.length, 50, 'Expected all 50 global companies on /thor-companies/');
  for (const company of companies) {
    const escapedName = company.name.replaceAll('&', '&amp;');
    assert.ok(
      companiesHtml.includes(company.name) || companiesHtml.includes(escapedName),
      `Missing company ${company.name} on /thor-companies/`,
    );
    assert.ok(
      companiesHtml.includes(`href="${company.href}"`),
      `Missing specific brand profile/external URL for ${company.name}: ${company.href}`,
    );
    assert.ok(company.logoId, `Missing logoId for ${company.name}`);
    assert.ok(company.description && company.description.length > 15, `Missing description for ${company.name}`);
  }
  assert.ok(companiesHtml.includes('data-company-filter="all"'));
  assert.ok(companiesHtml.includes('data-company-filter="TOWABLES"'));
  assert.ok(companiesHtml.includes('data-company-filter="MOTORIZED"'));
  for (const stat of companyStats) {
    const escapedValue = stat.value.replaceAll('+', '+');
    assert.ok(companiesHtml.includes(`<dd>${escapedValue}</dd>`));
    assert.ok(companiesHtml.includes(`<dt>${stat.label}</dt>`));
  }
  assert.ok(companiesHtml.includes(companyGlobalOverview.title));
});

test('Sustainability routes (/sustainability/, /sustainability-report/, /sustainability-environmental/, /social-responsibility/, /governance/, /supply-management/) satisfy VAL-SUST-001 and VAL-SUST-002', async () => {
  const sustainabilitySlugs = [
    'sustainability',
    'sustainability-report',
    'sustainability-environmental',
    'social-responsibility',
    'governance',
    'supply-management',
  ];

  // Shared sustainability subnavigation across all 6 sustainability routes, including single shared /innovation/ route
  assert.equal(sustainabilityNav.length, 7);
  for (const slug of sustainabilitySlugs) {
    const html = await readFile(path.join('dist', slug, 'index.html'), 'utf8');
    assert.ok(html.includes('aria-label="Sustainability navigation"'), `Missing sustainability subnav on /${slug}/`);
    for (const item of sustainabilityNav) {
      const expectedHref = siteUrl(`/${item.slug}/`);
      assert.ok(
        html.includes(`href="${expectedHref}"`),
        `/${slug}/ missing sustainability subnav link to ${expectedHref}`,
      );
    }
  }

  // VAL-SUST-001: /sustainability/ hub
  const hubHtml = await readFile('dist/sustainability/index.html', 'utf8');
  assert.ok(hubHtml.includes(`<h1>${sustainabilityHubData.hero.title}</h1>`));
  assert.ok(hubHtml.includes(`<h2>${sustainabilityHubData.approach.title}</h2>`));
  for (const para of sustainabilityHubData.approach.intro) {
    assert.ok(hubHtml.includes(para));
  }
  for (const pillar of sustainabilityHubData.approach.pillars) {
    assert.ok(hubHtml.includes(`<h3>${pillar.name}</h3>`));
    for (const para of pillar.paragraphs) {
      assert.ok(hubHtml.includes(para.slice(0, 50)));
    }
  }
  for (const callout of sustainabilityHubData.callouts) {
    assert.ok(hubHtml.includes(`<h2>${callout.title}</h2>`));
    assert.ok(hubHtml.includes(`href="${siteUrl(`/${callout.slug}/`)}"`));
  }
  assert.ok(hubHtml.includes(`<h2>${sustainabilityHubData.committeeCollage.title}</h2>`));
  assert.ok(hubHtml.includes(`href="${sustainabilityHubData.committeeCollage.href}"`));
  assert.ok(hubHtml.includes(`<h2>${sustainabilityHubData.reportBanner.title}</h2>`));
  assert.ok(hubHtml.includes(`href="${sustainabilityHubData.reportBanner.href}"`));
  assert.ok(hubHtml.includes(`href="${siteUrl('/sustainability-report/')}"`));

  // VAL-SUST-002: /sustainability-report/ current & archived PDFs
  const reportHtml = await readFile('dist/sustainability-report/index.html', 'utf8');
  assert.ok(reportHtml.includes(`<h1>${sustainabilityReportData.hero.title}</h1>`));
  assert.ok(reportHtml.includes(sustainabilityReportData.currentReport.eyebrow));
  assert.ok(reportHtml.includes(`href="${sustainabilityReportData.currentReport.href}"`));
  assert.ok(reportHtml.includes(sustainabilityReportData.currentReport.action));
  assert.ok(reportHtml.includes(`<h2>${sustainabilityReportData.archiveSection.title}</h2>`));

  assert.equal(sustainabilityReportData.archiveSection.reports.length, 8);
  const archiveCardMatches = [...reportHtml.matchAll(/<article\b[^>]*class="report-archive-card"[^>]*>/g)];
  assert.equal(archiveCardMatches.length, 8, 'Expected all 8 archived sustainability report cards on /sustainability-report/');
  for (const r of sustainabilityReportData.archiveSection.reports) {
    assert.ok(reportHtml.includes(`<span class="eyebrow">${r.year}</span>`), `Missing archive report year ${r.year}`);
    assert.ok(reportHtml.includes(r.label), `Missing archive report label ${r.label}`);
    assert.ok(reportHtml.includes(`href="${r.href}"`), `Missing archive report PDF href ${r.href}`);
    assert.ok(
      reportHtml.includes(`/thor-industries-redesign/media/${r.image}-`),
      `Missing local WebP cover graphic ${r.image} for ${r.label}`,
    );
  }

  // VAL-SUST-001: /sustainability-environmental/
  const envHtml = await readFile('dist/sustainability-environmental/index.html', 'utf8');
  assert.ok(envHtml.includes(`<h1>${sustainabilityEnvironmentalData.hero.title}</h1>`));
  for (const sec of sustainabilityEnvironmentalData.sections) {
    const escapedTitle = sec.title.replaceAll('&', '&amp;');
    assert.ok(
      envHtml.includes(`<h2>${sec.title}</h2>`) || envHtml.includes(`<h2>${escapedTitle}</h2>`),
      `Missing environmental section heading ${sec.title}`,
    );
    if (sec.href) {
      assert.ok(envHtml.includes(`href="${sec.href}"`), `Missing environmental link ${sec.href}`);
    }
  }
  assert.ok(envHtml.includes('August 1, 2018 through July 31, 2019'));
  assert.ok(envHtml.includes('67,000 tons of scrap waste'));
  for (const partner of sustainabilityEnvironmentalData.partnerCallouts) {
    assert.ok(envHtml.includes(`<h2>${partner.title}</h2>`));
    assert.ok(envHtml.includes(`href="${partner.href}"`));
    assert.ok(envHtml.includes(`/thor-industries-redesign/media/${partner.image}-`));
  }

  // VAL-SUST-001: /social-responsibility/
  const socialHtml = await readFile('dist/social-responsibility/index.html', 'utf8');
  assert.ok(socialHtml.includes(`<h1>${socialResponsibilityData.hero.title}</h1>`));
  assert.equal(socialResponsibilityData.callouts.length, 4);
  for (const callout of socialResponsibilityData.callouts) {
    assert.ok(socialHtml.includes(`<h2>${callout.title}</h2>`));
    assert.ok(socialHtml.includes(`href="${callout.href}"`));
    assert.ok(socialHtml.includes(`/thor-industries-redesign/media/${callout.image}-`));
  }
  assert.ok(socialHtml.includes(`href="${siteUrl('/community/')}"`));

  // VAL-SUST-001: /governance/
  const govHtml = await readFile('dist/governance/index.html', 'utf8');
  assert.ok(govHtml.includes(`<h1>${governanceData.hero.title}</h1>`));
  assert.ok(govHtml.includes(governanceData.boardSection.committeeLead));
  assert.equal(governanceData.boardSection.committees.length, 4);
  for (const committee of governanceData.boardSection.committees) {
    assert.ok(govHtml.includes(committee.slice(0, 35)));
  }
  assert.ok(govHtml.includes(`<h2>${governanceData.stakeholderSection.title}</h2>`));
  for (const callout of governanceData.callouts) {
    assert.ok(govHtml.includes(`<h2>${callout.title}</h2>`));
    assert.ok(govHtml.includes(`href="${callout.href}"`));
  }

  // VAL-SUST-001: /supply-management/
  const supplyHtml = await readFile('dist/supply-management/index.html', 'utf8');
  assert.ok(supplyHtml.includes(`<h1>${supplyManagementData.hero.title}</h1>`));
  assert.equal(supplyManagementData.callouts.length, 6);
  for (const callout of supplyManagementData.callouts) {
    assert.ok(supplyHtml.includes(`<h2>${callout.title}</h2>`));
    assert.ok(supplyHtml.includes(`href="${callout.href}"`));
    assert.ok(supplyHtml.includes(`/thor-industries-redesign/media/${callout.image}-`));
  }
});

test('navigation, footer, and handoffs match captured THOR information architecture (VAL-NAV-001..004)', async () => {
  // VAL-NAV-001: Top-level navigation order and non-page dropdown parents
  assert.deepEqual(
    navigation.map((group) => group.label),
    [
      'RV Finder',
      'Stories',
      'RV Basics',
      'About THOR',
      'THOR Companies',
      'Sustainability',
      'Investors',
    ],
  );

  const rvBasicsGroup = navigation.find((g) => g.label === 'RV Basics');
  const aboutThorGroup = navigation.find((g) => g.label === 'About THOR');
  assert.ok(rvBasicsGroup && aboutThorGroup);
  assert.equal(rvBasicsGroup.slug, undefined);
  assert.equal(aboutThorGroup.slug, undefined);
  assert.equal(rvBasicsGroup.href, undefined);
  assert.equal(aboutThorGroup.href, undefined);

  // VAL-NAV-004: Captured footer explore links, 5 social channels, and 7 utility/legal links
  const exploreGroup = footerGroups.find((g) => g.label === 'Explore');
  assert.ok(exploreGroup?.items);
  assert.deepEqual(
    exploreGroup.items.slice(0, 4).map((item) => ({
      label: item.label,
      href: navItemHref(item),
    })),
    [
      { label: 'Explore Companies', href: '/thor-industries-redesign/thor-companies/' },
      { label: 'Explore Careers', href: '/thor-industries-redesign/careers/' },
      { label: 'Explore Sustainability', href: '/thor-industries-redesign/sustainability/' },
      { label: 'Explore Innovation', href: '/thor-industries-redesign/innovation/' },
    ],
  );

  assert.deepEqual(
    socialLinks.map((s) => ({ label: s.label, href: s.href })),
    [
      {
        label: 'Follow Thor Industries on Facebook',
        href: 'https://www.facebook.com/ThorIndustries/?fref=ts&utm_source=thorindustries.com&utm_medium=referral',
      },
      {
        label: 'Follow Thor Industries on Instagram',
        href: 'https://www.instagram.com/thorindustries/?hl=en&utm_source=thorindustries.com&utm_medium=referral',
      },
      {
        label: 'Follow Thor Industries on Pinterest',
        href: 'https://www.pinterest.com/thorindustries/',
      },
      {
        label: 'Follow Thor Industries on Linkedin',
        href: 'https://www.linkedin.com/company/thor-industries',
      },
      {
        label: 'Follow Thor Industries on Youtube',
        href: 'https://www.youtube.com/thorindustries',
      },
    ],
  );

  assert.deepEqual(
    footerLinks.map((link) => ({ label: link.label, href: navItemHref(link) })),
    [
      { label: 'Contact Us', href: 'https://www.thorindustries.com/contact-us' },
      { label: 'Careers', href: '/thor-industries-redesign/careers/' },
      {
        label: 'Terms and Conditions',
        href: 'https://www.thorindustries.com/terms-and-conditions',
      },
      { label: 'Privacy Policy', href: 'https://www.thorindustries.com/privacy-policy' },
      { label: 'Legal', href: 'https://www.thorindustries.com/legal' },
      { label: 'Cookie Policy', href: 'https://www.thorindustries.com/cookie-policy' },
      { label: 'Accessibility', href: 'https://www.thorindustries.com/accessibility' },
    ],
  );

  // Verify header & footer markup across all 23 built pages
  for (const slug of expectedSlugs) {
    const file = slug ? path.join('dist', slug, 'index.html') : path.join('dist', 'index.html');
    const html = await readFile(file, 'utf8');
    assert.ok(html.includes('aria-label="Primary navigation"'), `missing desktop nav on ${file}`);
    assert.ok(html.includes('aria-label="Mobile navigation"'), `missing mobile nav on ${file}`);
    assert.ok(html.includes('aria-label="Footer navigation"'), `missing footer nav on ${file}`);
    assert.ok(html.includes('data-search-open'), `missing search open trigger on ${file}`);
    assert.ok(html.includes('data-menu-open'), `missing mobile menu trigger on ${file}`);
    assert.ok(html.includes('Static editorial redesign preview'), `missing redesign context on ${file}`);
    assert.ok(!html.includes('tiktok.com'), `unexpected TikTok link on ${file}`);
  }
});

test('search index covers all 23 built pages and matches titles, headings, and body phrases (VAL-SEARCH-001..003)', async () => {
  // VAL-SEARCH-001: dist/search-index.json exists, parses, and has exactly 23 C23 records
  const rawIndex = await readFile('dist/search-index.json', 'utf8');
  const parsedIndex = JSON.parse(rawIndex);
  assert.equal(parsedIndex.length, 23);
  assert.equal(searchRecords.length, 23);

  const indexUrls = parsedIndex.map((rec) => rec.url);
  assert.equal(new Set(indexUrls).size, 23);
  const expectedUrls = expectedSlugs.map((slug) =>
    slug ? `${BASE_PATH}/${slug}/` : `${BASE_PATH}/`,
  );
  assert.deepEqual(new Set(indexUrls), new Set(expectedUrls));

  for (const record of parsedIndex) {
    assert.ok(record.title && record.title.length > 0);
    assert.ok(record.label && record.label.length > 0);
    assert.ok(record.group && record.group.length > 0);
    assert.ok(record.description && record.description.length > 0);
    assert.ok(Array.isArray(record.headings) && record.headings.length > 0);
    assert.ok(record.body && record.body.length > 40);
    assert.ok(record.url.startsWith(`${BASE_PATH}/`) && record.url.endsWith('/'));
    assert.ok(!record.url.startsWith('http'));
  }

  // Inline search index in Header matches the 23 C23 records with no external entries
  const homeHtml = await readFile('dist/index.html', 'utf8');
  const inlineMatch = homeHtml.match(
    /<script type="application\/json"[^>]*data-search-index[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(inlineMatch, 'missing inline data-search-index script');
  const inlineRecords = JSON.parse(inlineMatch[1]);
  assert.equal(inlineRecords.length, 23);
  for (const rec of inlineRecords) {
    assert.ok(rec.url.startsWith(`${BASE_PATH}/`), `non-local search record URL: ${rec.url}`);
  }

  // VAL-SEARCH-001: Title and body phrase queries across all route groups
  const queries = [
    { query: 'Towing Guide', expectedUrl: '/thor-industries-redesign/towing-guide/' },
    { query: 'Trailer Life Magazine', expectedUrl: '/thor-industries-redesign/towing-guide/' },
    { query: 'Trade-in Value Collateral', expectedUrl: '/thor-industries-redesign/financing-your-rv/' },
    { query: 'Fifth Wheel Toy Hauler', expectedUrl: '/thor-industries-redesign/rv-types/' },
    { query: 'Frequently Asked Questions', expectedUrl: '/thor-industries-redesign/faq/' },
    { query: 'Regional Trip Guides', expectedUrl: '/thor-industries-redesign/stories/category/travel/' },
    { query: 'Campfire Dutch Oven', expectedUrl: '/thor-industries-redesign/stories/category/recipes/' },
    { query: 'Four Key Pillars of Innovation', expectedUrl: '/thor-industries-redesign/innovation/' },
    { query: 'Harbinger Hybrid Class A', expectedUrl: '/thor-industries-redesign/innovation/' },
    { query: 'Wade Thompson Peter Orthwein', expectedUrl: '/thor-industries-redesign/history/' },
    { query: 'Habitat for Humanity', expectedUrl: '/thor-industries-redesign/community/' },
    { query: 'Fast Company 2025 World Changing Ideas Award', expectedUrl: '/thor-industries-redesign/news-events/' },
    { query: 'Global Headquarters Elkhart', expectedUrl: '/thor-industries-redesign/careers/' },
    { query: 'Erwin Hymer Group', expectedUrl: '/thor-industries-redesign/thor-companies/' },
    { query: 'Business Ambition for 1.5', expectedUrl: '/thor-industries-redesign/sustainability/' },
    { query: 'FY2025 Sustainability Report', expectedUrl: '/thor-industries-redesign/sustainability-report/' },
    { query: 'Carbon and Climate Disclosure Report', expectedUrl: '/thor-industries-redesign/sustainability-report/' },
    { query: '67,000 tons of carbon', expectedUrl: '/thor-industries-redesign/sustainability-environmental/' },
    { query: 'LEAP Program', expectedUrl: '/thor-industries-redesign/community/' },
    { query: 'Occupational Health and Safety', expectedUrl: '/thor-industries-redesign/social-responsibility/' },
    { query: 'Nominating and Corporate Governance Committee', expectedUrl: '/thor-industries-redesign/governance/' },
    { query: 'Conflict Minerals Policy', expectedUrl: '/thor-industries-redesign/supply-management/' },
  ];

  for (const { query, expectedUrl } of queries) {
    const results = search(parsedIndex, query);
    assert.ok(results.length > 0, `expected search results for "${query}"`);
    assert.ok(
      results.some((r) => r.url === expectedUrl),
      `expected "${query}" to match ${expectedUrl}, got ${results.map((r) => r.url).join(', ')}`,
    );
  }

  // VAL-SEARCH-002 & VAL-SEARCH-003: Empty, whitespace, punctuation, unmatched, and XSS-like queries
  assert.deepEqual(search(parsedIndex, ''), []);
  assert.deepEqual(search(parsedIndex, '    '), []);
  assert.deepEqual(search(parsedIndex, '??? !!!'), []);
  assert.deepEqual(search(parsedIndex, 'zzzznonexistentquery98765'), []);
  assert.deepEqual(search(parsedIndex, '<img src=x onerror=alert(1)>'), []);
  assert.ok(normalize('THOR’s Café & Résumé').includes('thors cafe resume'));

  // Search dialog controls exist in rendered HTML
  assert.ok(homeHtml.includes('data-search-input'));
  assert.ok(homeHtml.includes('data-search-clear'));
  assert.ok(homeHtml.includes('data-search-close'));
  assert.ok(homeHtml.includes('data-search-empty'));
  assert.ok(homeHtml.includes('data-search-no-results'));
  assert.ok(homeHtml.includes('data-search-index-url="/thor-industries-redesign/search-index.json"'));
});

test('cross-page journeys, handoffs, and no-JS static rendering work across all 23 pages (VAL-CROSS-001..003)', async () => {
  const c23SlugSet = new Set(expectedSlugs.filter(Boolean));

  for (const slug of expectedSlugs) {
    const file = slug ? path.join('dist', slug, 'index.html') : path.join('dist', 'index.html');
    const html = await readFile(file, 'utf8');

    // VAL-CROSS-003: Main landmark, skip link, non-empty H1, and static body content without JS
    assert.ok(html.includes('<a class="skip-link" href="#main-content">Skip to main content</a>'));
    assert.ok(html.includes('<main id="main-content">'));
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    assert.ok(h1Match && h1Match[1].replace(/<[^>]+>/g, '').trim().length > 0, `empty H1 in ${file}`);

    // No runtime dependency on THOR/Prismic image CDNs in rendered media src/srcset/style attributes
    const mediaAttrs = [
      ...html.matchAll(/\b(?:src|srcset|style)="([^"]*)"/g),
    ].map((m) => m[1]);
    for (const attr of mediaAttrs) {
      assert.ok(!attr.includes('thorindustries-prod.zaneray.com'), `external Zaneray CDN media in ${file}: ${attr}`);
      assert.ok(!attr.includes('images.prismic.io'), `external Prismic CDN media in ${file}: ${attr}`);
    }

    // Inspect all href attributes in the page
    const hrefs = [...html.matchAll(/\bhref="([^"]*)"/g)].map((m) => m[1]);
    assert.ok(hrefs.length > 20, `expected >20 links in ${file}`);

    for (const href of hrefs) {
      assert.ok(href.length > 0, `empty href="" in ${file}`);
      assert.notEqual(href, '#', `dead "#" link in ${file}`);
      assert.ok(!href.startsWith('javascript:'), `javascript: href in ${file}`);
      assert.ok(!href.includes('localhost') && !href.includes('127.0.0.1'), `localhost href in ${file}`);

      if (href.startsWith('https://www.thorindustries.com/')) {
        const pathPart = href
          .replace('https://www.thorindustries.com/', '')
          .split('#')[0]
          .split('?')[0]
          .replace(/\/$/, '');

        // Intentional source handoffs on specific C23 pages:
        // - /financing-your-rv calculator handoff on financing-your-rv
        // - /innovation video/newsletter handoffs on innovation
        const isIntentionalFinancingCalculator =
          slug === 'financing-your-rv' && pathPart === 'financing-your-rv';
        const isIntentionalInnovationHandoff =
          slug === 'innovation' && pathPart === 'innovation';

        if (!isIntentionalFinancingCalculator && !isIntentionalInnovationHandoff) {
          assert.ok(
            !c23SlugSet.has(pathPart),
            `link to migrated C23 slug "${pathPart}" in ${file} points to external ${href} instead of local ${BASE_PATH}/${pathPart}/`,
          );
        }
      }
    }
  }
});

test('404 is real static content and release workflow/config/README satisfy VAL-RELEASE-001', async () => {
  const html = await readFile('dist/404.html', 'utf8');
  assert.ok(html.includes('noindex'));
  assert.ok(html.includes('Page not found'));
  assert.ok(!existsSync('dist/thor-industries-redesign'), 'dist must not contain doubly nested project base folder');

  // 1. Pinned dependencies, Node 24 engine, and scripts in package.json and package-lock.json
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
  const rootLock = lock.packages?.[''];
  assert.ok(rootLock, 'package-lock.json missing root package entry');

  assert.equal(pkg.engines?.node, '>=24.0.0');
  assert.equal(rootLock.engines?.node, '>=24.0.0');
  assert.deepEqual(pkg.dependencies, { astro: '7.4.0', sharp: '0.35.5' });
  assert.deepEqual(pkg.devDependencies, { '@astrojs/check': '0.9.10', typescript: '6.0.3' });
  assert.deepEqual(rootLock.dependencies, pkg.dependencies);
  assert.deepEqual(rootLock.devDependencies, pkg.devDependencies);
  assert.equal(lock.packages['node_modules/astro']?.version, '7.4.0');
  assert.equal(lock.packages['node_modules/sharp']?.version, '0.35.5');
  assert.equal(lock.packages['node_modules/@astrojs/check']?.version, '0.9.10');
  assert.equal(lock.packages['node_modules/typescript']?.version, '6.0.3');

  assert.equal(pkg.scripts?.check, 'astro check');
  assert.equal(pkg.scripts?.build, 'astro build');
  assert.equal(pkg.scripts?.test, 'node --test --test-concurrency=2');
  assert.equal(pkg.scripts?.dev, 'astro dev --ignore-lock');
  assert.equal(pkg.scripts?.preview, 'astro preview --ignore-lock');

  // 2. Astro config invariants
  const astroConfig = await readFile('astro.config.mjs', 'utf8');
  for (const snippet of [
    "site: 'https://rbiren.github.io'",
    "base: '/thor-industries-redesign/'",
    "output: 'static'",
    "trailingSlash: 'always'",
    "build: { format: 'directory' }",
    "server: { host: '127.0.0.1' }",
  ]) {
    assert.ok(astroConfig.includes(snippet), `astro.config.mjs missing ${snippet}`);
  }

  // 3. GitHub Pages workflow order and artifact path
  const workflow = await readFile('.github/workflows/pages.yml', 'utf8');
  assert.ok(workflow.includes("node-version: '24'"));
  assert.ok(workflow.includes('name: github-pages'));
  assert.ok(workflow.includes('pages: write'));
  assert.ok(workflow.includes('id-token: write'));
  assert.ok(!workflow.includes('path: .'));
  assert.ok(!workflow.includes('thor-industries-redesign/dist'));

  const orderedSteps = ['npm ci', 'npm run check', 'npm run build', 'npm test', 'path: dist'];
  let prevIdx = -1;
  for (const step of orderedSteps) {
    const idx = workflow.indexOf(step);
    assert.ok(idx > prevIdx, `Workflow step "${step}" missing or out of order`);
    prevIdx = idx;
  }

  // 4. README documents toolchain, commands, loopback ports 4173/4174, C23 routes, external handoffs, and Pages deployment
  const readme = await readFile('README.md', 'utf8');
  for (const requiredText of [
    'Node 24.21.0',
    'npm 11.19.0',
    '7.4.0',
    '0.35.5',
    '0.9.10',
    '6.0.3',
    'npm ci',
    'npm run check',
    'npm run build',
    'npm test',
    'npm run dev -- --host 127.0.0.1 --port 4173',
    'npm run preview -- --host 127.0.0.1 --port 4174',
    'http://127.0.0.1:4173/thor-industries-redesign/',
    'http://127.0.0.1:4174/thor-industries-redesign/',
    'https://rbiren.github.io/thor-industries-redesign/',
    'https://www.thorindustries.com/find-my-rv',
    'https://www.thorindustries.com/trip-calculator',
    'https://www.thorindustries.com/financing-your-rv',
    'https://ir.thorindustries.com/ir-home/default.aspx',
    'path: dist',
  ]) {
    assert.ok(readme.includes(requiredText), `README.md missing required delivery documentation: ${requiredText}`);
  }
  assert.ok(!readme.includes('localhost:4321'), 'README.md must not document default Astro port 4321');

  for (const slug of expectedSlugs) {
    const routePath = slug ? `/${slug}/` : '/';
    assert.ok(readme.includes(`\`${routePath}\``), `README.md missing canonical C23 route ${routePath}`);
  }
});
