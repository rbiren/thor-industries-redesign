import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { sources } from '../src/data/media-sources.mjs';
import { companies } from '../src/data/companies.mjs';

const all = { ...sources, ...Object.fromEntries(companies.filter(c => c.logo).map(c => [`logo-${c.id}`, c.logo])) };
await mkdir('src/assets/originals', { recursive: true });
const metadata = {};
for (const [id, url] of Object.entries(all)) {
  const original = `src/assets/originals/${id}`;
  let bytes;
  try {
    bytes = await readFile(original);
  } catch {
    // Finite, authorized asset inventory only. No crawl or link traversal.
    const response = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { Accept: 'image/png,image/jpeg,image/webp' } });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image ${id}: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 20_000_000) throw new Error(`Image ${id}: size limit`);
    await writeFile(original, bytes);
  }
  const info = await sharp(bytes).metadata();
  const logo = id.includes('logo');
  const widths = logo ? [240, 480] : [480, 960, 1600, 1920].filter(w => w <= info.width);
  if (!logo && !widths.includes(info.width)) widths.push(info.width);
  if (!widths.length) widths.push(info.width);
  for (const width of widths) {
    let image = sharp(bytes);
    if (logo) image = image.trim();
    await image.resize({ width }).webp({ quality: logo ? 90 : 82 }).toFile(`public/media/${id}-${width}.webp`);
  }
  const variant = await sharp(`public/media/${id}-${widths.at(-1)}.webp`).metadata();
  metadata[id] = {
    source: url, format: info.format, width: variant.width, height: variant.height,
    widths, sha256: createHash('sha256').update(bytes).digest('hex'),
  };
  console.log(`${id}: ${info.width}×${info.height} ${info.format}`);
}
await writeFile('src/data/media.json', JSON.stringify(metadata, null, 2) + '\n');
await sharp(await readFile('src/assets/originals/thor-logo')).trim().resize(64, 64, {
  fit: 'contain', background: '#ffffff',
}).png().toFile('public/favicon.png');
