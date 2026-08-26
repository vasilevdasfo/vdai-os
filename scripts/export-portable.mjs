import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const apiUrl = process.env.TWENTY_API_URL;
const apiKey = process.env.TWENTY_API_KEY;
if (!apiUrl || !apiKey) throw new Error('Set TWENTY_API_URL and TWENTY_API_KEY. Never commit the key.');

const objectNames = ['vdaiWorkspaces', 'vdaiProjects', 'vdaiTasks', 'vdaiMemberships', 'vdaiGrants', 'vdaiHelpRequests', 'vdaiProofs', 'vdaiAutomations'];
const objects = {};
for (const objectName of objectNames) {
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/rest/${objectName}?limit=500`, { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!response.ok) throw new Error(`${objectName}: HTTP ${response.status}`);
  const payload = await response.json();
  objects[objectName] = payload.data ?? payload[objectName] ?? payload;
}

const output = { format: 'vdai-portable-v1', generatedAt: new Date().toISOString(), synthetic: false, objects };
const exportDir = resolve('exports');
await mkdir(exportDir, { recursive: true });
const filename = resolve(exportDir, `vdai-${new Date().toISOString().replaceAll(':', '-')}.json`);
await writeFile(filename, `${JSON.stringify(output, null, 2)}\n`, { mode: 0o600 });
console.log(filename);
