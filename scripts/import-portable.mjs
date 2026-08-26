import { readFile } from 'node:fs/promises';

const [inputFile, mode] = process.argv.slice(2);
if (!inputFile) throw new Error('Usage: node scripts/import-portable.mjs <export.json> [--apply]');
const payload = JSON.parse(await readFile(inputFile, 'utf8'));
if (payload.format !== 'vdai-portable-v1' || !payload.objects) throw new Error('Unsupported export format.');

const count = Object.values(payload.objects).reduce((total, rows) => total + (Array.isArray(rows) ? rows.length : 0), 0);
if (!['--apply', '--verify'].includes(mode)) {
  console.log(JSON.stringify({ mode: 'dry-run', records: count, objectNames: Object.keys(payload.objects) }, null, 2));
  process.exit(0);
}

const apiUrl = process.env.TWENTY_API_URL;
const apiKey = process.env.TWENTY_API_KEY;
if (!apiUrl || !apiKey) throw new Error('Set TWENTY_API_URL and TWENTY_API_KEY. Never commit the key.');

const systemFields = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy']);
const identityFields = {
  vdaiWorkspaces: ['externalId'],
  vdaiProjects: ['externalId'],
  vdaiTasks: ['externalId'],
  vdaiMemberships: ['memberRef'],
  vdaiGrants: ['projectId', 'memberRef', 'projectRole'],
  vdaiHelpRequests: ['taskId', 'requestedByRef', 'participantRef', 'helpRole'],
  vdaiProofs: ['taskId', 'artifactRef', 'verifierRef'],
  vdaiAutomations: ['projectId', 'ownerRef', 'tier'],
};

const baseUrl = apiUrl.replace(/\/$/, '');
const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
const created = {};
const skipped = {};
const verified = {};
for (const [objectName, rows] of Object.entries(payload.objects)) {
  if (!Array.isArray(rows)) throw new Error(`${objectName} must be an array.`);
  const keys = identityFields[objectName];
  if (!keys) throw new Error(`${objectName}: unsupported object.`);
  const listResponse = await fetch(`${baseUrl}/rest/${objectName}?limit=500`, { headers });
  if (!listResponse.ok) throw new Error(`${objectName}: list HTTP ${listResponse.status} ${await listResponse.text()}`);
  const listPayload = await listResponse.json();
  const existing = listPayload?.data?.[objectName] ?? listPayload?.[objectName] ?? listPayload?.data ?? listPayload;
  if (!Array.isArray(existing)) throw new Error(`${objectName}: unexpected list response shape.`);
  created[objectName] = 0;
  skipped[objectName] = 0;
  verified[objectName] = 0;
  for (const row of rows) {
    const data = Object.fromEntries(Object.entries(row).filter(([key]) => !systemFields.has(key)));
    if (keys.some((key) => data[key] === undefined || data[key] === null || data[key] === '')) {
      throw new Error(`${objectName}: missing identity field in ${keys.join('+')}.`);
    }
    const matched = existing.find((candidate) => keys.every((key) => candidate[key] === data[key]));
    if (mode === '--verify') {
      if (!matched) throw new Error(`${objectName}: missing ${keys.map((key) => `${key}=${data[key]}`).join(', ')}`);
      const mismatchedFields = Object.entries(data)
        .filter(([key, value]) => JSON.stringify(matched[key]) !== JSON.stringify(value))
        .map(([key]) => key);
      if (mismatchedFields.length) throw new Error(`${objectName}: field mismatch in ${mismatchedFields.join(', ')}.`);
      verified[objectName] += 1;
      continue;
    }
    const duplicate = Boolean(matched);
    if (duplicate) {
      skipped[objectName] += 1;
      continue;
    }
    const response = await fetch(`${baseUrl}/rest/${objectName}`, {
      method: 'POST', headers, body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`${objectName}: HTTP ${response.status} ${await response.text()}`);
    created[objectName] += 1;
    existing.push(data);
  }
}
console.log(JSON.stringify(
  mode === '--verify'
    ? { mode: 'verified', records: count, verified }
    : { mode: 'applied', records: count, created, skipped },
  null,
  2,
));
