import { pages } from '../data/pages';
import { companies } from '../data/companies.mjs';
import { routeUrl } from '../lib/urls';
export function GET() {
  const records = pages.map(page => ({
    title: page.title,
    url: routeUrl(page.slug),
    label: page.label,
    description: page.description,
    body: [
      ...(page.lead || []),
      ...page.sections.flatMap(section => [section.title, ...(section.text || []), ...(section.bullets || []), ...(section.cards || []).flatMap(card => [card.title, card.text || '', card.eyebrow || ''])]),
      ...(page.kind === 'companies' ? companies.map(company => `${company.name} ${company.group}`) : []),
    ].join(' '),
  }));
  return new Response(JSON.stringify(records), { headers: { 'Content-Type': 'application/json' } });
}
