export interface SearchRecord {
  title: string;
  url: string;
  label: string;
  description: string;
  body: string;
}
export function normalize(text: string) {
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
export function search(records: SearchRecord[], query: string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return records.slice(0, 6);
  return records.map(record => {
    const title = normalize(record.title);
    const description = normalize(record.description);
    const haystack = normalize(`${record.title} ${record.label} ${record.description} ${record.body}`);
    const score = terms.every(term => haystack.includes(term))
      ? terms.reduce((sum, term) => sum + (title.includes(term) ? 10 : description.includes(term) ? 4 : 1), 0)
      : 0;
    return { record, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score).map(item => item.record);
}
