import {
  BASE_PATH,
  SITE_ORIGIN,
  getCanonicalRoute,
} from '../data/routes.ts';

const metaEnv = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env;
export const base = metaEnv?.BASE_URL || BASE_PATH;

export function siteUrl(target = '/') {
  if (/^(https?:|mailto:|tel:|#)/.test(target)) return target;
  return `${base}${target.replace(/^\/+/, '')}`;
}

export function routeUrl(slug: string) {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  return siteUrl(clean ? `${clean}/` : '');
}

export function canonicalUrl(slugOrPath = '') {
  const localPath = slugOrPath.startsWith(base) ? slugOrPath : routeUrl(slugOrPath);
  return new URL(localPath, SITE_ORIGIN).href;
}

export function routeOutputFile(slug: string, outDir = 'dist') {
  const cleanOutDir = outDir.replace(/\/+$/, '');
  const clean = slug.replace(/^\/+|\/+$/g, '');
  return clean ? `${cleanOutDir}/${clean}/index.html` : `${cleanOutDir}/index.html`;
}

export function routeHref(slug: string, options: { forceLocal?: boolean } = {}) {
  const route = getCanonicalRoute(slug);
  if (!route) return routeUrl(slug);
  if (options.forceLocal || route.built) {
    return routeUrl(route.slug);
  }
  return route.sourceUrl;
}

export function resolveHref(target: string, options: { forceLocal?: boolean } = {}) {
  if (/^(mailto:|tel:|#)/.test(target)) return target;
  const route = getCanonicalRoute(target);
  if (route) {
    return options.forceLocal || route.built ? routeUrl(route.slug) : route.sourceUrl;
  }
  if (/^https?:\/\//i.test(target)) return target;
  return siteUrl(target);
}

export function sectionId(title: string, index: number) {
  return `section-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

