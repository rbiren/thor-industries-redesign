import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rbiren.github.io',
  base: '/thor-industries-redesign/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  server: { host: '127.0.0.1' },
});
