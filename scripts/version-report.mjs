import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const compose = readFileSync(new URL('../compose.yaml', import.meta.url), 'utf8');
const image = compose.match(/image: (twentycrm\/twenty:[^\s]+)/)?.[1] ?? 'unknown';
const git = (args) => {
  try { return execFileSync('git', args, { encoding: 'utf8' }).trim(); } catch { return 'unknown'; }
};

console.log(JSON.stringify({
  appVersion: packageJson.version,
  gitCommit: git(['rev-parse', '--short=12', 'HEAD']),
  gitDirty: Boolean(git(['status', '--porcelain'])),
  twentyImage: image,
  portableDataContract: 'vdai-portable-v1',
  identityRule: 'externalId/sourceRef; never row position',
}, null, 2));

