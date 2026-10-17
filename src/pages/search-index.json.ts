import { searchRecords } from '../data/search-index-data';

export function GET() {
  return new Response(JSON.stringify(searchRecords), {
    headers: { 'Content-Type': 'application/json' },
  });
}
