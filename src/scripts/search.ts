export interface SearchRecord {
  slug?: string;
  title: string;
  url: string;
  label: string;
  group?: string;
  description: string;
  headings?: string[];
  body: string;
}

export function normalize(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’‘]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function search(records: SearchRecord[], rawQuery: string): SearchRecord[] {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];
  const normalizedQuery = normalize(trimmed);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return records
    .map((record) => {
      const title = normalize(record.title);
      const label = normalize(record.label);
      const description = normalize(record.description);
      const headings = normalize((record.headings ?? []).join(' '));
      const slug = normalize((record.slug ?? '').replace(/\//g, ' '));
      const body = normalize(record.body);
      const haystack = `${title} ${label} ${headings} ${description} ${slug} ${body}`;

      if (!terms.every((term) => haystack.includes(term))) {
        return { record, score: 0 };
      }

      let score = 0;
      if (label === normalizedQuery || title === normalizedQuery) score += 120;
      else if (title.includes(normalizedQuery) || label.includes(normalizedQuery)) score += 60;
      if (headings.includes(normalizedQuery)) score += 35;
      if (description.includes(normalizedQuery)) score += 20;
      if (body.includes(normalizedQuery)) score += 12;

      for (const term of terms) {
        if (label === term || title === term) score += 30;
        else if (title.includes(term)) score += 16;
        if (label.includes(term)) score += 14;
        if (headings.includes(term)) score += 10;
        if (slug.includes(term)) score += 8;
        if (description.includes(term)) score += 6;
        if (body.includes(term)) score += 2;
      }

      return { record, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.record);
}
