import { readFile, readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const requiredFiles = ['compose.yaml', '.env.example', 'LICENSE', 'NOTICE', 'SECURITY.md', 'SETUP.md', 'SBOM.cdx.json', 'fixtures/demo-portable.json', 'fixtures/problemos-demo-portable.json'];
for (const file of requiredFiles) await readFile(file, 'utf8');

async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (['.git', '.twenty', '.yarn', 'backups', 'dist', 'exports', 'node_modules', 'runtime'].includes(entry.name)) continue;
    if (entry.name.startsWith('.env') && entry.name !== '.env.example') continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...await files(path)); else result.push(path);
  }
  return result;
}

const textExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.yaml', '.yml', '.md', '.sh', '']);
const findings = [];
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
];
for (const file of await files('.')) {
  if (!textExtensions.has(extname(file))) continue;
  const content = await readFile(file, 'utf8');
  for (const pattern of secretPatterns) if (pattern.test(content)) findings.push(`${file}: ${pattern}`);
}

const fixture = JSON.parse(await readFile('fixtures/demo-portable.json', 'utf8'));
if (fixture.synthetic !== true || fixture.format !== 'vdai-portable-v1') findings.push('Demo fixture is not explicitly synthetic/portable-v1.');
const problemOsFixture = JSON.parse(await readFile('fixtures/problemos-demo-portable.json', 'utf8'));
if (problemOsFixture.synthetic !== true || problemOsFixture.format !== 'vdai-portable-v1') findings.push('ProblemOS fixture is not explicitly synthetic/portable-v1.');

const compose = await readFile('compose.yaml', 'utf8');
if (!compose.includes('twentycrm/twenty:v2.35.0@sha256:')) findings.push('Twenty image is not pinned by version and digest.');
if (!compose.includes('postgres:16-alpine@sha256:')) findings.push('Postgres image is not pinned by version and digest.');
if (!compose.includes('redis:7-alpine@sha256:')) findings.push('Redis image is not pinned by version and digest.');
if (/ports:\s*\n\s*-\s*["']?(5432|6379):/m.test(compose)) findings.push('Database or Redis port is exposed to the host.');

if (findings.length) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log('PUBLIC_VERIFY_OK');
