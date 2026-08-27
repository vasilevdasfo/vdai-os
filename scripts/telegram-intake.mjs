import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const [deltaFile, configFile, outputFile] = process.argv.slice(2);
if (!deltaFile || !configFile) {
  throw new Error('Usage: node scripts/telegram-intake.mjs <delta.json> <config.json> [output.json]');
}

const [delta, config] = await Promise.all([
  readFile(deltaFile, 'utf8').then(JSON.parse),
  readFile(configFile, 'utf8').then(JSON.parse),
]);

const requiredConfig = ['chatId', 'contactRef', 'workspace', 'project', 'tasks', 'topics'];
for (const key of requiredConfig) {
  if (config[key] === undefined) throw new Error(`Missing config.${key}`);
}
if (String(delta.chat_id) !== String(config.chatId).replace(/^-100/, '')) {
  throw new Error(`Chat allowlist mismatch: expected ${config.chatId}, got ${delta.chat_id}`);
}
if (!Array.isArray(delta.messages) || !Array.isArray(config.topics)) throw new Error('Messages and topics must be arrays.');

function redact(value) {
  return String(value ?? '')
    .replace(/https?:\/\/\S+/giu, '[link]')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/giu, '[email]')
    .replace(/\b(?:gh[opsu]_[A-Za-z0-9_]+|[A-Za-z0-9_-]{32,})\b/gu, '[secret]')
    .replace(/\s+/gu, ' ')
    .trim();
}

function boundedSummary(text) {
  const clean = redact(text);
  const first = clean.split(/(?<=[.!?])\s+/u)[0] || clean;
  return first.length <= 280 ? first : `${first.slice(0, 277)}...`;
}

const interactions = [];
const events = [];
const matchedTaskIds = new Set();
for (const message of delta.messages) {
  if (!Number.isInteger(message.id) || !config.allowedSenderIds.includes(message.sender_id)) continue;
  const normalized = String(message.text ?? '').toLocaleLowerCase('ru');
  const topic = config.topics.find((candidate) =>
    candidate.keywords.some((keyword) => normalized.includes(String(keyword).toLocaleLowerCase('ru'))),
  );
  if (!topic) continue;
  const task = config.tasks.find((candidate) => candidate.key === topic.taskKey);
  if (!task) throw new Error(`Topic ${topic.name} references unknown task ${topic.taskKey}`);
  const sourceRef = `tg://chat/${config.chatId}/message/${message.id}`;
  const summary = boundedSummary(message.text);
  interactions.push({
    name: `${topic.name} · TG #${message.id}`,
    contactRef: config.contactRef,
    channel: 'TELEGRAM',
    sourceRef,
    summary,
    decision: topic.decision,
    nextAction: task.nextStep,
  });
  events.push({
    name: `${topic.name} · входящее #${message.id}`,
    taskId: task.externalId,
    eventType: 'COMMENT',
    actorRef: message.sender_id === config.sashaSenderId ? 'sasha:l7' : 'dmitrii:l8',
    summary,
    sourceRef,
  });
  matchedTaskIds.add(task.externalId);
}

const objects = {
  vdaiWorkspaces: [config.workspace],
  vdaiProjects: [config.project],
  vdaiTasks: config.tasks.map(({ key, ...task }) => task),
  vdaiInteractions: interactions,
  vdaiTaskEvents: events,
};
const payload = {
  format: 'vdai-portable-v1',
  generatedAt: new Date().toISOString(),
  synthetic: false,
  source: { chatId: config.chatId, previousMessageId: delta.previous_last_message_id, proposedMessageId: delta.proposed_last_message_id },
  intake: { scanned: delta.messages.length, matched: interactions.length, taskCount: matchedTaskIds.size },
  objects,
};

if (outputFile) {
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
  console.log(JSON.stringify({ mode: 'converted', ...payload.intake, output: outputFile }));
} else {
  console.log(JSON.stringify(payload, null, 2));
}
