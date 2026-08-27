import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const guide = readFileSync('docs/VERSIONING_AND_SYNC.md', 'utf8');
const syncGuide = readFileSync('docs/CENTRAL_SYNC.md', 'utf8');

describe('version and sync contract', () => {
  it('separates code, schema, data and audit history', () => {
    for (const layer of ['Код приложения', 'Схема CRM', 'Данные', 'История']) expect(guide).toContain(layer);
  });

  it('does not claim GitHub transports live CRM data', () => {
    expect(guide).toContain('GitHub не является живой базой');
    expect(guide).toContain('Git apply: меняет приложение/схему');
    expect(guide).toMatch(/не является каналом пользовательских\s+данных/);
  });

  it('keeps one central CRM and explicit Sasha access gate', () => {
    expect(syncGuide).toContain('одна центральная CRM');
    expect(syncGuide).toContain('workspace role ∩ membership ∩ active project grant');
    expect(syncGuide).toContain('статус остаётся `NOT_ISSUED`');
  });
});
