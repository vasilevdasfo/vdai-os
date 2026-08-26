import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('ProblemOS bridge', () => {
  it('converts the six-event contract into an idempotent VDAI payload', () => {
    const output = join(mkdtempSync(join(tmpdir(), 'vdai-bridge-')), 'portable.json');
    execFileSync('node', ['scripts/problemos-bridge.mjs', 'fixtures/problemos-events.json', '--output', output]);
    const payload = JSON.parse(readFileSync(output, 'utf8'));

    expect(payload.synthetic).toBe(true);
    expect(payload.sourceFormat).toBe('problemos-events-v1');
    expect(Object.values(payload.objects).flat()).toHaveLength(10);
    expect(payload.objects.vdaiTasks[0].sourceKey).toBe('synthetic:bridge:card:001');
    expect(payload.objects.vdaiHelpRequests[0].participantRef).toBe('synthetic:reviewer:l7');
    expect(payload.objects.vdaiProofs[0]).toMatchObject({ verifierRef: 'synthetic:reviewer:l7', verdict: 'ACCEPTED' });
  });
});
