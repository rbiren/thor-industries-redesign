export const SITE_ORIGIN = 'https://rbiren.github.io';
export const BASE_PATH = '/thor-industries-redesign';
export const SOURCE_ORIGIN = 'https://www.thorindustries.com';

export const CANONICAL_SLUGS = [
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
] as const;

export type CanonicalSlug = (typeof CANONICAL_SLUGS)[number];

export type RouteGroup =
  | 'home'
  | 'stories'
  | 'rv-basics'
  | 'about'
  | 'companies'
  | 'sustainability';

export interface CanonicalRoute {
  slug: CanonicalSlug;
  path: string;
  label: string;
  group: RouteGroup;
  sourceUrl: string;
  built: boolean;
}

const routeDefinitions: Array<Omit<CanonicalRoute, 'path' | 'sourceUrl'>> = [
  { slug: '', label: 'Home', group: 'home', built: true },
  { slug: 'stories', label: 'Stories', group: 'stories', built: true },
  { slug: 'stories/category/learn', label: 'Learn', group: 'stories', built: true },
  { slug: 'stories/category/recipes', label: 'Recipes', group: 'stories', built: true },
  { slug: 'stories/category/on-the-road', label: 'On the Road', group: 'stories', built: true },
  { slug: 'stories/category/travel', label: 'Travel', group: 'stories', built: true },
  { slug: 'stories/category/video', label: 'Video', group: 'stories', built: true },
  { slug: 'rv-types', label: 'RV Types', group: 'rv-basics', built: true },
  { slug: 'financing-your-rv', label: 'Financing Your RV', group: 'rv-basics', built: true },
  { slug: 'towing-guide', label: 'Towing Guide', group: 'rv-basics', built: true },
  { slug: 'faq', label: 'FAQ', group: 'rv-basics', built: true },
  { slug: 'innovation', label: 'Innovation', group: 'about', built: false },
  { slug: 'history', label: 'History', group: 'about', built: false },
  { slug: 'community', label: 'Community', group: 'about', built: false },
  { slug: 'news-events', label: 'News & Events', group: 'about', built: false },
  { slug: 'careers', label: 'Careers', group: 'about', built: false },
  { slug: 'thor-companies', label: 'THOR Companies', group: 'companies', built: false },
  { slug: 'sustainability', label: 'Sustainability', group: 'sustainability', built: false },
  { slug: 'sustainability-report', label: 'Sustainability Report', group: 'sustainability', built: false },
  { slug: 'sustainability-environmental', label: 'Environmental', group: 'sustainability', built: false },
  { slug: 'social-responsibility', label: 'Social Responsibility', group: 'sustainability', built: false },
  { slug: 'governance', label: 'Governance', group: 'sustainability', built: false },
  { slug: 'supply-management', label: 'Supply Management', group: 'sustainability', built: false },
];

export const canonicalRoutes: CanonicalRoute[] = routeDefinitions.map((route) => ({
  ...route,
  path: route.slug ? `/${route.slug}/` : '/',
  sourceUrl: route.slug ? `${SOURCE_ORIGIN}/${route.slug}` : `${SOURCE_ORIGIN}/`,
}));

export const canonicalRouteMap = new Map<CanonicalSlug, CanonicalRoute>(
  canonicalRoutes.map((route) => [route.slug, route]),
);

export function getCanonicalRoute(slugOrPath: string): CanonicalRoute | undefined {
  const withoutBase = slugOrPath.startsWith(BASE_PATH)
    ? slugOrPath.slice(BASE_PATH.length)
    : slugOrPath;
  const clean = withoutBase.replace(/^\/+|\/+$/g, '') as CanonicalSlug;
  return canonicalRouteMap.get(clean);
}

export const builtRoutes = canonicalRoutes.filter((route) => route.built);

export const sourceHandoffs = {
  rvFinder: `${SOURCE_ORIGIN}/find-my-rv`,
  tripCalculator: `${SOURCE_ORIGIN}/trip-calculator`,
  investors: 'https://ir.thorindustries.com/ir-home/default.aspx',
  contact: `${SOURCE_ORIGIN}/contact-us`,
  terms: `${SOURCE_ORIGIN}/terms`,
  privacy: `${SOURCE_ORIGIN}/privacy`,
  cookies: `${SOURCE_ORIGIN}/cookie-policy`,
  youtubeBoardVideoId: 'HlXl0gFApyQ',
  youtubeBoardVideo: 'https://www.youtube.com/watch?v=HlXl0gFApyQ',
  youtubeBoardVideoEmbed: 'https://www.youtube.com/embed/HlXl0gFApyQ',
  instagram: 'https://www.instagram.com/thorindustries/',
  facebook: 'https://www.facebook.com/goeverywherestayanywhere',
  youtube: 'https://www.youtube.com/channel/UCMakeAnAdventure',
  tiktok: 'https://www.tiktok.com/@thorindustries',
  pinterest: 'https://www.pinterest.com/thorindustries/',
} as const;

export const forbiddenLocalSlugs = [
  'find-my-rv',
  'trip-calculator',
  'investors',
  'contact-us',
  'terms',
  'privacy',
  'cookie-policy',
  'search',
] as const;
