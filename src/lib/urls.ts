export const base = import.meta.env.BASE_URL;
export function siteUrl(path = '/') {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  return `${base}${path.replace(/^\/+/, '')}`;
}
export function routeUrl(slug: string) {
  return siteUrl(slug ? `${slug}/` : '');
}
export function sectionId(title: string, index: number) {
  return `section-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}
