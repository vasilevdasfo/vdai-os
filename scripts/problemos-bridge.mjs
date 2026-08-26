import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const REQUIRED_FIELDS = ['sourceKey', 'project', 'task', 'actor', 'eventType', 'timestamp', 'payloadRef'];
const EVENT_ORDER = [
  'problem.intake.started',
  'problem.card.created',
  'task.next_step.selected',
  'task.history.appended',
  'help.request.created',
  'proof.confirmed',
];
const ALLOWED_ACTORS = new Set(['operator-l6', 'reviewer-l7', 'steward-l8']);

function stableUuid(value) {
  const hex = createHash('sha256').update(value).digest('hex').slice(0, 32).split('');
  hex[12] = '4';
  hex[16] = ['8', '9', 'a', 'b'][Number.parseInt(hex[16], 16) % 4];
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20).join('')}`;
}

function title(value) {
  return value.split(/[-_]/).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

export function validateContract(payload) {
  if (payload?.format !== 'problemos-events-v1' || payload?.synthetic !== true || !Array.isArray(payload.events)) {
    throw new Error('Expected an explicitly synthetic problemos-events-v1 payload.');
  }
  if (payload.events.length !== EVENT_ORDER.length) throw new Error(`Expected exactly ${EVENT_ORDER.length} events.`);
  const sourceKeys = new Set();
  const first = payload.events[0];
  for (const [index, event] of payload.events.entries()) {
    const keys = Object.keys(event).sort();
    if (JSON.stringify(keys) !== JSON.stringify([...REQUIRED_FIELDS].sort())) throw new Error(`Event ${index + 1} must contain only the seven contract fields.`);
    for (const field of REQUIRED_FIELDS) if (typeof event[field] !== 'string' || !event[field]) throw new Error(`Event ${index + 1}: invalid ${field}.`);
    if (event.eventType !== EVENT_ORDER[index]) throw new Error(`Event ${index + 1}: expected ${EVENT_ORDER[index]}.`);
    if (event.project !== first.project || event.task !== first.task) throw new Error('All events must reference one project and one task.');
    if (!event.sourceKey.startsWith('synthetic:') || sourceKeys.has(event.sourceKey)) throw new Error('sourceKey must be unique and synthetic.');
    if (!event.payloadRef.startsWith('synthetic://')) throw new Error('payloadRef must be an opaque synthetic reference.');
    if (!ALLOWED_ACTORS.has(event.actor)) throw new Error(`Unsupported actor ${event.actor}.`);
    if (Number.isNaN(Date.parse(event.timestamp)) || !event.timestamp.endsWith('Z')) throw new Error('timestamp must be UTC ISO-8601.');
    sourceKeys.add(event.sourceKey);
  }
  if (payload.events.at(-1).actor !== 'reviewer-l7') throw new Error('Proof must be confirmed by reviewer-l7, not the L6 operator.');
  return payload.events;
}

export function toPortable(events) {
  const projectSlug = events[0].project;
  const taskSlug = events[0].task;
  const workspaceId = stableUuid('problemos:workspace:synthetic');
  const projectId = stableUuid(`problemos:project:${projectSlug}`);
  const taskId = stableUuid(`problemos:task:${projectSlug}:${taskSlug}`);
  return {
    format: 'vdai-portable-v1',
    generatedAt: new Date().toISOString(),
    synthetic: true,
    sourceFormat: 'problemos-events-v1',
    objects: {
      vdaiWorkspaces: [{ name: 'ProblemOS Synthetic Bridge', externalId: workspaceId, privacy: 'PRIVATE', levelCeiling: 8 }],
      vdaiProjects: [{ name: title(projectSlug), externalId: projectId, workspaceId, sourceKey: `synthetic:problemos:project:${projectSlug}`, ownerRef: 'synthetic:steward:l8', levelCeiling: 7 }],
      vdaiTasks: [{ name: title(taskSlug), externalId: taskId, projectId, sourceKey: events[1].sourceKey, ownerRef: 'synthetic:operator:l6', nextStep: 'Execute the selected next step and append a bounded history event', proofRequirement: 'A separate L7 reviewer confirms the synthetic trace' }],
      vdaiMemberships: [
        { name: 'Demo Operator L6', memberRef: 'synthetic:operator:l6', clubLevel: 6, evidenceRef: 'synthetic:proof:operator-l6' },
        { name: 'Demo Reviewer L7', memberRef: 'synthetic:reviewer:l7', clubLevel: 7, evidenceRef: 'synthetic:proof:reviewer-l7' },
      ],
      vdaiGrants: [
        { name: 'L6 operates bridge task', projectId, memberRef: 'synthetic:operator:l6', projectRole: 'EDITOR' },
        { name: 'L7 independently reviews bridge proof', projectId, memberRef: 'synthetic:reviewer:l7', projectRole: 'REVIEWER' },
      ],
      vdaiHelpRequests: [{ name: 'Review ProblemOS bridge trace', taskId, requestedByRef: 'synthetic:operator:l6', participantRef: 'synthetic:reviewer:l7', helpRole: 'COMMENTER', request: `Review ${events[4].payloadRef} and identify one missing assumption` }],
      vdaiProofs: [{ name: 'ProblemOS bridge trace confirmed', taskId, artifactRef: events[5].payloadRef, verifierRef: 'synthetic:reviewer:l7', verdict: 'ACCEPTED' }],
      vdaiAutomations: [{ name: 'ProblemOS event projection', projectId, ownerRef: 'synthetic:operator:l6', tier: 'A2_DRAFT', permissions: ['read:synthetic-events', 'write:draft-task-history'] }],
    },
  };
}

const args = process.argv.slice(2);
if (args[0]) {
  const inputPath = args[0];
  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : null;
  if (outputIndex >= 0 && !outputPath) throw new Error('--output requires a path.');
  const payload = JSON.parse(await readFile(inputPath, 'utf8'));
  const portable = toPortable(validateContract(payload));
  if (outputPath) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(portable, null, 2)}\n`, { mode: 0o600 });
    console.log(JSON.stringify({ mode: 'converted', events: payload.events.length, records: Object.values(portable.objects).flat().length, output: outputPath }));
  } else {
    console.log(JSON.stringify(portable, null, 2));
  }
}
