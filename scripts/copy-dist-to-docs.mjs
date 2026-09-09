// Copies the Vite production build into docs/ so GitHub Pages (source:
// main branch, /docs folder) can serve it directly. Only touches
// index.html and assets/ — never removes the hand-written methodology
// markdown files that live alongside them in docs/.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const docs = join(root, 'docs');

if (!existsSync(dist)) {
  console.error('dist/ not found — run `bun run build` first.');
  process.exit(1);
}

rmSync(join(docs, 'assets'), { recursive: true, force: true });
mkdirSync(join(docs, 'assets'), { recursive: true });
cpSync(join(dist, 'assets'), join(docs, 'assets'), { recursive: true });
cpSync(join(dist, 'index.html'), join(docs, 'index.html'));
writeFileSync(join(docs, '.nojekyll'), '');

console.log('Copied dist/ into docs/ for GitHub Pages.');
