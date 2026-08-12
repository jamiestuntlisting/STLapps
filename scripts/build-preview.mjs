/*
 * Bundles the site into one self-contained HTML file.
 *
 * The app itself is deliberately split across files — that's what makes
 * apps.js editable. But a shareable preview has to be a single page with no
 * separate requests, so this inlines the stylesheet and flattens the three
 * ES modules into one <script type="module">.
 *
 *   node scripts/build-preview.mjs [outfile]
 *
 * It's a preview builder, not a bundler: it assumes the module graph is the
 * three files below, in this order. Add a fourth module and add it here too.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, process.argv[2] || 'dist/preview.html');

const read = (rel) => readFile(resolve(root, 'public', rel), 'utf8');

/* Drop the import lines and the `export` keywords, leaving plain declarations
   that work once the files sit in one scope. */
function flatten(source) {
  return source
    .replace(/^import[\s\S]*?from\s+'[^']+';\s*$/gm, '')
    .replace(/^export\s+(const|function|class|let)\b/gm, '$1')
    .trim();
}

const [html, css, apps, icons, app] = await Promise.all([
  read('index.html'),
  read('css/styles.css'),
  read('js/apps.js'),
  read('js/icons.js'),
  read('js/app.js'),
]);

const script = [apps, icons, app].map(flatten).join('\n\n');

const page = html
  .replace(
    '<link rel="stylesheet" href="css/styles.css">',
    `<style>\n${css}\n</style>`,
  )
  .replace(
    '<script type="module" src="js/app.js"></script>',
    `<script type="module">\n${script}\n</script>`,
  )
  /* Nothing external survives in a single file. */
  .replace(/^\s*<link rel="manifest"[^>]*>\s*$/m, '')
  .replace(/^\s*<link rel="apple-touch-icon"[^>]*>\s*$/m, '');

await mkdir(dirname(out), { recursive: true });
await writeFile(out, page);

console.log(`preview → ${out} (${(page.length / 1024).toFixed(1)} kB)`);
