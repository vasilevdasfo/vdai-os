import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const bootstrap = readFileSync('scripts/windows-bootstrap.ps1', 'utf8');
const runbook = readFileSync('docs/EVGENY_WINDOWS_RUNBOOK.md', 'utf8');

describe('Evgeny Windows pilot package', () => {
  it('binds locally, generates secrets locally and requires explicit start', () => {
    expect(bootstrap).toContain('VDAI_BIND=127.0.0.1');
    expect(bootstrap).toContain('RandomNumberGenerator');
    expect(bootstrap).toContain("if (-not $Start)");
    expect(bootstrap).not.toContain('docker compose down --volumes');
  });

  it('preserves economy and external-action gates', () => {
    for (const contract of ['8 model/tool', '2 повтора', '40 шагов', '>2M', '100 шагов', '>10M', 'Кэш не отключать']) {
      expect(runbook).toContain(contract);
    }
    expect(runbook).toContain('До gate запрещены отправка архива, invite, логин');
    expect(runbook).toContain('не запрашиваются и не передаются');
  });
});
