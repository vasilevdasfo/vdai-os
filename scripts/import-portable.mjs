import { readFile } from 'node:fs/promises';

const [inputFile, mode] = process.argv.slice(2);
if (!inputFile) throw new Error('Usage: node scripts/import-portable.mjs <export.json> [--apply]');
const payload = JSON.parse(await readFile(inputFile, 'utf8'));
if (payload.format !== 'vdai-portable-v1' || !payload.objects) throw new Error('Unsupported export format.');

const count = Object.values(payload.objects).reduce((total, rows) => total + (Array.isArray(rows) ? rows.length : 0), 0);
if (mode !== '--apply') {
  console.log(JSON.stringify({ mode: 'dry-run', records: count, objectNames: Object.keys(payload.objects) }, null, 2));
  process.exit(0);
}

const apiUrl = process.env.TWENTY_API_URL;
const apiKey = process.env.TWENTY_API_KEY;
if (!apiUrl || !apiKey) throw new Error('Set TWENTY_API_URL and TWENTY_API_KEY. Never commit the key.');

const systemFields = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt', 'createdBy', 'updatedBy']);
for (const [objectName, rows] of Object.entries(payload.objects)) {
  if (!Array.isArray(rows)) throw new Error(`${objectName} must be an array.`);
  for (const row of rows) {
    const data = Object.fromEntries(Object.entries(row).filter(([key]) => !systemFields.has(key)));
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/rest/${objectName}`, {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`${objectName}: HTTP ${response.status} ${await response.text()}`);
  }
}
console.log(JSON.stringify({ mode: 'applied', records: count }, null, 2));
