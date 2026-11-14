// Inlines dist/app.css and dist/app.js into page.html -> dist/index.html (single-file page).
import { readFileSync, writeFileSync } from 'node:fs';
const here = new URL('.', import.meta.url);
const css = readFileSync(new URL('dist/app.css', here), 'utf8').replace(/<\/style/gi, '<\\/style');
const js = readFileSync(new URL('dist/app.js', here), 'utf8').replace(/<\/script/gi, '<\\/script');
const html = readFileSync(new URL('page.html', here), 'utf8')
  .replace('<link rel="stylesheet" href="app.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script src="app.js"></script>', () => `<script>\n${js}\n</script>`);
writeFileSync(new URL('dist/index.html', here), html);
console.log('dist/index.html', html.length, 'bytes');
