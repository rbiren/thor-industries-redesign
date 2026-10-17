import { builtPages } from './pages.ts';
import { builtRoutes } from './routes.ts';
import {
  categories,
  faqRelatedStories,
  homeBuyingSeason,
  homeFeaturedStories,
  homeNewsEvents,
  storiesHubCategories,
  storiesHubFeatured,
  storyCategoryPages,
} from './stories.mjs';
import { homeRvTypes, rvTypes, rvTypesClosingCallouts } from './rv-types.mjs';
import {
  companies,
  companyGlobalOverview,
  companyGroups,
  companyStats,
  homeBrands,
} from './companies.mjs';
import {
  careersData,
  communityData,
  historyData,
  innovationData,
  newsEventsData,
  thorCompaniesData,
} from './corporate.mjs';
import {
  governanceData,
  socialResponsibilityData,
  supplyManagementData,
  sustainabilityEnvironmentalData,
  sustainabilityHubData,
  sustainabilityReportData,
} from './sustainability.mjs';
import { questions } from './faq.mjs';
import { routeHref } from '../lib/urls.ts';
import type { Page } from './types.ts';

export interface SearchRecord {
  slug: string;
  title: string;
  url: string;
  label: string;
  group: string;
  description: string;
  headings: string[];
  body: string;
}

function cleanTokens(parts: Array<string | undefined | null>): string {
  return parts
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPageExtras(page: Page): { headings: string[]; body: string[] } {
  const headings: string[] = [
    page.title,
    page.label,
    ...page.sections.flatMap((section) => [
      section.title,
      ...(section.subtitle ? [section.subtitle] : []),
      ...(section.cards ?? []).map((card) => card.title),
    ]),
  ];

  const body: string[] = [
    page.description,
    ...(page.lead ?? []),
    ...page.sections.flatMap((section) => [
      section.title,
      section.subtitle ?? '',
      ...(section.text ?? []),
      ...(section.bullets ?? []),
      ...(section.cards ?? []).flatMap((card) => [
        card.eyebrow ?? '',
        card.title,
        card.text ?? '',
        ...(card.tags ?? []),
      ]),
    ]),
  ];

  if (page.slug === '') {
    headings.push(
      'THOR Family of Companies',
      'Find Your RV',
      'Buying Season Is Here',
      'Featured Stories',
      'News & Events',
      ...homeRvTypes.map((rv) => rv.title),
      ...homeBuyingSeason.map((item) => item.title),
      ...homeFeaturedStories.map((story) => story.title),
      ...homeNewsEvents.map((news) => news.title),
    );
    body.push(
      ...homeBrands.map((brand) => brand.name),
      ...homeRvTypes.map((rv) => rv.title),
      ...homeBuyingSeason.flatMap((item) => [item.eyebrow, item.title, item.text]),
      ...homeFeaturedStories.flatMap((story) => [story.eyebrow, story.title, story.text]),
      ...homeNewsEvents.flatMap((news) => [news.eyebrow, news.title, news.text]),
    );
  } else if (page.slug === 'stories') {
    headings.push(
      ...storiesHubFeatured.map((s) => String(s.title)),
      ...categories.map((cat) => cat.label),
      ...storiesHubCategories.flatMap((cat) => [
        cat.title,
        ...cat.stories.map((story) => story.title),
      ]),
    );
    body.push(
      ...storiesHubFeatured.flatMap((s) => [String(s.eyebrow), String(s.title), String(s.text)]),
      ...storiesHubCategories.flatMap((cat) => [
        cat.title,
        ...cat.stories.flatMap((story) => [
          story.eyebrow,
          story.title,
          story.text,
          ...(story.tags ?? []),
        ]),
      ]),
    );
  } else if (page.slug.startsWith('stories/category/')) {
    const catKey = page.categoryKey ?? page.slug.replace('stories/category/', '');
    const catData =
      (storyCategoryPages as Record<string, any>)[catKey] ??
      (storyCategoryPages as Record<string, any>)[page.slug];
    if (catData) {
      if (catData.heading) headings.push(String(catData.heading));
      if (catData.regionPromptTitle) headings.push(String(catData.regionPromptTitle));
      if (catData.featuredGuidesTitle) headings.push(String(catData.featuredGuidesTitle));
      if (catData.regionPromptText) body.push(String(catData.regionPromptText));
      if (Array.isArray(catData.filterGroups)) {
        body.push(
          ...catData.filterGroups.flatMap((fg: any) => [
            String(fg.label ?? ''),
            ...((fg.options ?? []) as string[]),
          ]),
        );
      }
      if (Array.isArray(catData.featuredGuides)) {
        headings.push(...catData.featuredGuides.map((g: any) => String(g.title)));
        body.push(
          ...catData.featuredGuides.flatMap((g: any) => [
            String(g.eyebrow ?? ''),
            String(g.title ?? ''),
            String(g.text ?? ''),
          ]),
        );
      }
      if (Array.isArray(catData.regions)) {
        headings.push('Regional Trip Guides', ...catData.regions.map((r: any) => String(r.name)));
        body.push(
          ...catData.regions.flatMap((r: any) => [
            String(r.name ?? ''),
            String(r.description ?? ''),
          ]),
        );
      }
      if (Array.isArray(catData.stories)) {
        headings.push(...catData.stories.map((s: any) => String(s.title)));
        body.push(
          ...catData.stories.flatMap((s: any) => [
            String(s.eyebrow ?? ''),
            String(s.title ?? ''),
            String(s.text ?? ''),
            ...((s.tags ?? []) as string[]),
          ]),
        );
      }
    }
  } else if (page.slug === 'rv-types') {
    headings.push(
      ...rvTypes.flatMap((item) => [item.eyebrow, item.title]),
      ...rvTypesClosingCallouts.map((callout) => callout.title),
    );
    body.push(
      ...rvTypes.flatMap((item) => [
        item.eyebrow,
        item.title,
        item.text,
        ...(item.features ?? []),
      ]),
      ...rvTypesClosingCallouts.flatMap((callout) => [
        callout.eyebrow,
        callout.title,
        callout.text,
      ]),
    );
  } else if (page.slug === 'financing-your-rv') {
    headings.push(
      'Few things to keep in mind:',
      'Trade-in Value',
      'Collateral',
      'HOW MUCH DOES IT REALLY COST?',
      'Payment Calculator Disclaimer',
      'FIND YOUR RV',
    );
    body.push(
      'Trade-in Value Collateral HOW MUCH DOES IT REALLY COST? Use our calculator to figure how affordable owning an RV can be for you. Payment Calculator Disclaimer The payment calculator is only a tool to estimate payments. Averages are based on credit history and loan terms. Exact figures will be determined by your financial institution at the time of application. FIND YOUR RV',
    );
  } else if (page.slug === 'towing-guide') {
    headings.push(
      'GUIDE TO TOWING',
      'MATCH YOUR TOW VEHICLE TO YOUR RV',
      'RV Safety & Education Foundation',
      'TRAILER LIFE TOWING GUIDE',
      'FIND YOUR PERFECT TOWABLE RV',
    );
    body.push(
      'GUIDE TO TOWING MATCH YOUR TOW VEHICLE TO YOUR RV RV Safety & Education Foundation TRAILER LIFE TOWING GUIDE Trailer Life Magazine is a top industry resource for all things RV FIND YOUR PERFECT TOWABLE RV',
    );
  } else if (page.slug === 'faq') {
    headings.push(
      ...questions.map((q) => String(q.title)),
      ...faqRelatedStories.map((s) => String(s.title)),
    );
    body.push(
      ...questions.flatMap((q) => [
        String(q.title),
        ...(Array.isArray(q.text) ? q.text.map(String) : []),
      ]),
      ...faqRelatedStories.flatMap((s) => [String(s.eyebrow), String(s.title), String(s.text)]),
    );
  } else if (page.slug === 'innovation') {
    headings.push(
      innovationData.hero.title,
      innovationData.hero.subtitle,
      ...innovationData.callouts.map((c) => c.title),
      innovationData.newsBanner.title,
      ...innovationData.moreCallouts.map((c) => c.title),
      innovationData.spotlightCallout.title,
      innovationData.labBanner.title,
      innovationData.signup.title,
    );
    body.push(
      innovationData.hero.title,
      innovationData.hero.subtitle,
      ...innovationData.intro.paragraphs,
      ...innovationData.callouts.flatMap((c) => [
        c.title,
        c.imageAlt ?? '',
        ...(c.paragraphs ?? []),
        ...(c.bullets ?? []),
      ]),
      innovationData.newsBanner.title,
      innovationData.newsBanner.imageAlt ?? '',
      ...innovationData.moreCallouts.flatMap((c) => [c.title, ...c.paragraphs]),
      innovationData.spotlightCallout.title,
      ...innovationData.spotlightCallout.paragraphs,
      innovationData.labBanner.title,
      innovationData.labBanner.text,
      innovationData.signup.title,
      innovationData.signup.text,
    );
  } else if (page.slug === 'history') {
    headings.push(
      historyData.hero.title,
      historyData.hero.subtitle,
      ...historyData.timeline.map((m) => `${m.year} ${m.title}`),
    );
    body.push(
      historyData.hero.title,
      historyData.hero.subtitle,
      ...historyData.intro.paragraphs,
      ...historyData.timeline.flatMap((m) => [m.year, m.title, m.text]),
    );
  } else if (page.slug === 'community') {
    headings.push(
      communityData.hero.title,
      communityData.hero.subtitle,
      ...communityData.callouts.map((c) => c.title),
    );
    body.push(
      communityData.hero.title,
      communityData.hero.subtitle,
      ...communityData.intro.paragraphs,
      ...communityData.callouts.flatMap((c) => [c.title, ...c.paragraphs]),
    );
  } else if (page.slug === 'news-events') {
    headings.push(
      newsEventsData.hero.title,
      newsEventsData.hero.subtitle,
      ...newsEventsData.items.map((item) => item.title),
    );
    body.push(
      newsEventsData.hero.title,
      newsEventsData.hero.subtitle,
      ...newsEventsData.intro.paragraphs,
      ...newsEventsData.items.flatMap((item) => [
        item.date,
        item.title,
        item.summary,
        item.sourceType ?? '',
      ]),
    );
  } else if (page.slug === 'careers') {
    headings.push(
      careersData.hero.title,
      careersData.hero.subtitle,
      careersData.globalHqCallout.title,
      careersData.familySection.title,
      ...careersData.familySection.companies.map((c) => c.name),
    );
    body.push(
      careersData.hero.title,
      careersData.hero.subtitle,
      ...careersData.intro.paragraphs,
      ...careersData.intro.bullets,
      careersData.globalHqCallout.title,
      careersData.globalHqCallout.text,
      careersData.familySection.title,
      careersData.familySection.intro,
      ...careersData.familySection.companies.flatMap((c) => [c.name, c.text]),
      careersData.familySection.transparencyNote,
    );
  } else if (page.slug === 'thor-companies') {
    headings.push(
      thorCompaniesData.hero.title,
      companyGlobalOverview.title,
      ...companyGroups.map(([groupName]) => String(groupName)),
      ...companies.map((c) => c.name),
    );
    body.push(
      thorCompaniesData.hero.title,
      thorCompaniesData.hero.text,
      companyGlobalOverview.title,
      companyGlobalOverview.text,
      ...companyStats.flatMap((s) => [s.value, s.label]),
      ...companyGroups.map(([groupName]) => String(groupName)),
      ...companies.flatMap((c) => [c.name, c.group, c.description, ...(c.tags ?? [])]),
    );
  } else if (page.slug === 'sustainability') {
    headings.push(
      sustainabilityHubData.hero.title,
      sustainabilityHubData.approach.title,
      ...sustainabilityHubData.approach.pillars.map((p) => p.name),
      ...sustainabilityHubData.callouts.map((c) => c.title),
      sustainabilityHubData.committeeCollage.title,
      sustainabilityHubData.reportBanner.title,
    );
    body.push(
      sustainabilityHubData.hero.title,
      sustainabilityHubData.approach.title,
      ...sustainabilityHubData.approach.intro,
      ...sustainabilityHubData.approach.pillars.flatMap((p) => [p.name, ...p.paragraphs]),
      ...sustainabilityHubData.callouts.flatMap((c) => [c.title, ...c.paragraphs]),
      sustainabilityHubData.committeeCollage.title,
      sustainabilityHubData.committeeCollage.caption,
      sustainabilityHubData.reportBanner.title,
    );
  } else if (page.slug === 'sustainability-report') {
    headings.push(
      sustainabilityReportData.hero.title,
      sustainabilityReportData.currentReport.eyebrow,
      sustainabilityReportData.currentReport.title,
      sustainabilityReportData.archiveSection.title,
      ...sustainabilityReportData.archiveSection.reports.map((r) => `${r.year} ${r.label}`),
    );
    body.push(
      sustainabilityReportData.hero.title,
      sustainabilityReportData.currentReport.eyebrow,
      sustainabilityReportData.currentReport.title,
      sustainabilityReportData.currentReport.reportingPeriod,
      sustainabilityReportData.currentReport.fileName,
      sustainabilityReportData.archiveSection.title,
      ...sustainabilityReportData.archiveSection.reports.flatMap((r) => [r.year, r.label]),
    );
  } else if (page.slug === 'sustainability-environmental') {
    headings.push(
      sustainabilityEnvironmentalData.hero.title,
      ...sustainabilityEnvironmentalData.sections.map((s) => s.title),
      ...sustainabilityEnvironmentalData.partnerCallouts.map((p) => p.title),
    );
    body.push(
      sustainabilityEnvironmentalData.hero.title,
      ...(sustainabilityEnvironmentalData.lead ?? []),
      ...sustainabilityEnvironmentalData.sections.flatMap((s) => [s.title, ...s.paragraphs]),
      ...sustainabilityEnvironmentalData.partnerCallouts.flatMap((p) => [
        p.title,
        ...p.paragraphs,
      ]),
    );
  } else if (page.slug === 'social-responsibility') {
    headings.push(
      socialResponsibilityData.hero.title,
      ...socialResponsibilityData.callouts.map((c) => c.title),
    );
    body.push(
      socialResponsibilityData.hero.title,
      ...(socialResponsibilityData.lead ?? []),
      ...socialResponsibilityData.callouts.flatMap((c) => [c.title, ...c.paragraphs]),
    );
  } else if (page.slug === 'governance') {
    headings.push(
      governanceData.hero.title,
      governanceData.boardSection.title,
      ...governanceData.boardSection.committees,
      governanceData.stakeholderSection.title,
      ...governanceData.callouts.map((c) => c.title),
    );
    body.push(
      governanceData.hero.title,
      ...(governanceData.lead ?? []),
      governanceData.boardSection.title,
      governanceData.boardSection.intro,
      governanceData.boardSection.committeeLead,
      ...governanceData.boardSection.committees,
      ...governanceData.boardSection.closing,
      governanceData.stakeholderSection.title,
      ...governanceData.stakeholderSection.paragraphs,
      ...governanceData.callouts.flatMap((c) => [c.title, ...c.paragraphs]),
    );
  } else if (page.slug === 'supply-management') {
    headings.push(
      supplyManagementData.hero.title,
      ...supplyManagementData.callouts.map((c) => c.title),
    );
    body.push(
      supplyManagementData.hero.title,
      ...(supplyManagementData.lead ?? []),
      ...supplyManagementData.callouts.flatMap((c) => [c.title, ...c.paragraphs]),
    );
  }

  const uniqueHeadings = Array.from(
    new Set(
      headings
        .filter((h): h is string => typeof h === 'string' && h.trim().length > 0)
        .map((h) => h.replace(/\s+/g, ' ').trim()),
    ),
  );

  return {
    headings: uniqueHeadings,
    body,
  };
}

export function buildSearchIndex(): SearchRecord[] {
  return builtPages.map((page) => {
    const extras = getPageExtras(page);
    const routeMeta = builtRoutes.find((r) => r.slug === page.slug);
    return {
      slug: page.slug,
      title: page.title,
      url: routeHref(page.slug),
      label: page.label,
      group: routeMeta?.group ?? page.label,
      description: page.description,
      headings: extras.headings,
      body: cleanTokens(extras.body),
    };
  });
}

export const searchRecords: SearchRecord[] = buildSearchIndex();
