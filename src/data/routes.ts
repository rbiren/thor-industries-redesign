export const ORIGIN = 'https://www.thorindustries.com';
export const IR_ORIGIN = 'https://ir.thorindustries.com';
export const SITE_ORIGIN = 'https://rbiren.github.io';
export const BASE_PATH = '/thor-industries-redesign/';

export const CANONICAL_SLUGS = [
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
] as const;

export type CanonicalSlug = (typeof CANONICAL_SLUGS)[number];
export type RouteGroup = 'home' | 'stories-education' | 'corporate-companies' | 'sustainability';

export interface CanonicalRoute {
  slug: CanonicalSlug;
  path: string;
  title: string;
  group: RouteGroup;
  sourceUrl: string;
  built: boolean;
}

function defineRoute(
  slug: CanonicalSlug,
  title: string,
  group: RouteGroup,
  built = false,
): CanonicalRoute {
  return {
    slug,
    path: slug ? `/${slug}/` : '/',
    title,
    group,
    sourceUrl: slug ? `${ORIGIN}/${slug}` : `${ORIGIN}/`,
    built,
  };
}

export const canonicalRoutes: readonly CanonicalRoute[] = [
  defineRoute('', 'THOR Industries', 'home', true),
  defineRoute('stories', 'Stories', 'stories-education', false),
  defineRoute('stories/learn', 'Learn', 'stories-education', false),
  defineRoute('stories/recipes', 'Recipes', 'stories-education', false),
  defineRoute('stories/on-the-road', 'On the Road', 'stories-education', false),
  defineRoute('stories/travel', 'Travel', 'stories-education', false),
  defineRoute('stories/video', 'Video', 'stories-education', false),
  defineRoute('rv-types', 'RV Types', 'stories-education', false),
  defineRoute('rv-faq', 'RV FAQ', 'stories-education', false),
  defineRoute('about-us', 'About Us', 'corporate-companies', false),
  defineRoute('our-history', 'Our History', 'corporate-companies', false),
  defineRoute('thor-leadership', 'THOR Leadership', 'corporate-companies', false),
  defineRoute('innovation', 'Innovation', 'corporate-companies', false),
  defineRoute('operations', 'Operations', 'corporate-companies', false),
  defineRoute('global-family-of-companies', 'Global Family of Companies', 'corporate-companies', false),
  defineRoute('european-companies', 'European Companies', 'corporate-companies', false),
  defineRoute('hymer', 'Hymer', 'corporate-companies', false),
  defineRoute('supply-companies', 'Supply Companies', 'corporate-companies', false),
  defineRoute('airxcel', 'Airxcel', 'corporate-companies', false),
  defineRoute('sustainability', 'Sustainability', 'sustainability', false),
  defineRoute('environmental', 'Environmental', 'sustainability', false),
  defineRoute('social-responsibility', 'Social Responsibility', 'sustainability', false),
  defineRoute('governance', 'Governance', 'sustainability', false),
];

export const canonicalRouteBySlug = new Map<string, CanonicalRoute>(
  canonicalRoutes.map(route => [route.slug, route]),
);

export const sourceHandoffs = {
  rvFinder: `${ORIGIN}/find-yours`,
  dealerLocator: `${ORIGIN}/locate-a-dealer`,
  investors: `${IR_ORIGIN}/`,
  newsroom: `${ORIGIN}/newsroom`,
  careers: `${ORIGIN}/careers`,
  contact: `${ORIGIN}/contact-us`,
  sustainabilityReport: `${ORIGIN}/sustainability-report`,
  supplyManagement: `${ORIGIN}/supply-management`,
  terms: `${ORIGIN}/terms`,
  privacy: `${ORIGIN}/privacy`,
  cookies: `${ORIGIN}/cookie-policy`,
  search: `${ORIGIN}/search`,
  whoIsThorVideo: 'https://www.youtube.com/watch?v=9nN03h6vX-o',
  whoIsThorVideoEmbed: 'https://www.youtube.com/embed/9nN03h6vX-o',
  youtubeChannel: 'https://www.youtube.com/channel/UCMakeAnAdventure',
} as const;

export const forbiddenLocalSlugs = [
  'stories/category/learn',
  'stories/category/recipes',
  'stories/category/on-the-road',
  'stories/category/travel',
  'stories/category/video',
  'faq',
  'history',
  'thor-companies',
  'sustainability-environmental',
  'financing-your-rv',
  'towing-guide',
  'community',
  'news-events',
  'careers',
  'sustainability-report',
  'supply-management',
  'about-thor',
  'rv-basics',
] as const;

const forbiddenSlugSet = new Set<string>(forbiddenLocalSlugs);

export function normalizeSlug(input: string): string {
  let value = input.trim();
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      if (parsed.origin !== ORIGIN) return value;
      value = parsed.pathname;
    } catch {
      return value;
    }
  }
  value = value.split(/[?#]/)[0];
  if (value.startsWith(BASE_PATH)) {
    value = value.slice(BASE_PATH.length);
  } else if (value === BASE_PATH.slice(0, -1)) {
    value = '';
  }
  return value.replace(/^\/+|\/+$/g, '');
}

export function getCanonicalRoute(slugOrPathOrUrl: string): CanonicalRoute | undefined {
  if (/^https?:\/\//i.test(slugOrPathOrUrl)) {
    try {
      const parsed = new URL(slugOrPathOrUrl);
      if (parsed.origin !== ORIGIN) return undefined;
      return canonicalRouteBySlug.get(parsed.pathname.replace(/^\/+|\/+$/g, ''));
    } catch {
      return undefined;
    }
  }
  return canonicalRouteBySlug.get(normalizeSlug(slugOrPathOrUrl));
}

export function isCanonicalRoute(slugOrPathOrUrl: string): boolean {
  return Boolean(getCanonicalRoute(slugOrPathOrUrl));
}

export function isBuiltRoute(slugOrPathOrUrl: string): boolean {
  return Boolean(getCanonicalRoute(slugOrPathOrUrl)?.built);
}

export function getBuiltRoutes(): CanonicalRoute[] {
  return canonicalRoutes.filter(route => route.built);
}

export type SourceHandoffCategory =
  | 'tool'
  | 'portal'
  | 'story-detail'
  | 'rv-type-detail'
  | 'company-profile'
  | 'news-detail'
  | 'legal'
  | 'document'
  | 'video'
  | 'external';

export function classifySourceHandoffUrl(url: string): SourceHandoffCategory | undefined {
  if (!/^https?:\/\//i.test(url)) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  if (parsed.origin === IR_ORIGIN) return 'portal';
  if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) return 'video';
  if (/\.pdf($|[?#])/i.test(parsed.pathname)) return 'document';
  if (parsed.origin !== ORIGIN) return 'external';

  const slug = parsed.pathname.replace(/^\/+|\/+$/g, '');
  if (canonicalRouteBySlug.has(slug)) return undefined;

  if (slug === 'find-yours' || slug === 'locate-a-dealer' || slug === 'search' || slug === 'find-my-rv' || slug === 'trip-calculator') {
    return 'tool';
  }
  if (slug === 'newsroom' || slug === 'careers' || slug === 'contact-us' || slug === 'sustainability-report' || slug === 'supply-management') {
    return 'portal';
  }
  if (slug === 'terms' || slug === 'privacy' || slug === 'cookie-policy' || slug === 'terms-and-conditions' || slug === 'privacy-policy') {
    return 'legal';
  }
  if (/^stories\/[^/]+\/[^/]+$/.test(slug)) return 'story-detail';
  if (/^rv-types\/[^/]+$/.test(slug)) return 'rv-type-detail';
  if (/^thor-companies\/[^/]+$/.test(slug)) return 'company-profile';
  if (slug.startsWith('news')) return 'news-detail';
  return 'external';
}

export function isSourceHandoffUrl(url: string): boolean {
  return Boolean(classifySourceHandoffUrl(url));
}

export type DestinationClassification =
  | {
      kind: 'canonical-route';
      route: CanonicalRoute;
      built: boolean;
      localUrl: string;
      sourceUrl: string;
      resolvedHref: string;
    }
  | {
      kind: 'source-handoff';
      category: SourceHandoffCategory;
      sourceUrl: string;
      resolvedHref: string;
    }
  | {
      kind: 'forbidden-local-route';
      slug: string;
      reason: string;
    };

export function classifyDestination(input: string): DestinationClassification {
  const canonical = getCanonicalRoute(input);
  if (canonical) {
    const localUrl = canonical.slug ? `${BASE_PATH}${canonical.slug}/` : BASE_PATH;
    return {
      kind: 'canonical-route',
      route: canonical,
      built: canonical.built,
      localUrl,
      sourceUrl: canonical.sourceUrl,
      resolvedHref: canonical.built ? localUrl : canonical.sourceUrl,
    };
  }

  const handoffCategory = classifySourceHandoffUrl(input);
  if (handoffCategory) {
    return {
      kind: 'source-handoff',
      category: handoffCategory,
      sourceUrl: input,
      resolvedHref: input,
    };
  }

  const slug = normalizeSlug(input);
  return {
    kind: 'forbidden-local-route',
    slug,
    reason: forbiddenSlugSet.has(slug)
      ? `Slug "${slug}" is explicitly excluded from the 23-route catalog`
      : `Slug "${slug}" is not in the approved 23-route catalog`,
  };
}
