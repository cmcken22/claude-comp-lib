// Rebuild the component library and copy its output into vendor/claude-comp-lib.
// Usage: npm run vendor:update -- [path to the claude-comp-lib repo]
// Defaults to ../.. (this project lives in the library repo under exports/).
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const libRoot = resolve(process.argv[2] ?? '../..');
const vendor = resolve('vendor/claude-comp-lib');

if (!existsSync(resolve(libRoot, 'src/index.ts'))) {
  console.error(`No component library found at ${libRoot}. Pass its path as an argument.`);
  process.exit(1);
}

console.log(`Building the library in ${libRoot}…`);
execSync('npm run build', { cwd: libRoot, stdio: 'inherit' });

rmSync(resolve(vendor, 'dist'), { recursive: true, force: true });
rmSync(resolve(vendor, 'tokens'), { recursive: true, force: true });
cpSync(resolve(libRoot, 'dist'), resolve(vendor, 'dist'), { recursive: true });
cpSync(resolve(libRoot, 'src/tokens'), resolve(vendor, 'tokens'), { recursive: true });
rmSync(resolve(vendor, 'dist/examples'), { recursive: true, force: true });

console.log('Vendor updated. Run `npm install` to refresh node_modules.');
