import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Telegram intake', () => {
  it('allows one chat, redacts content and creates deterministic source identities', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vdai-tg-'));
    const deltaPath = join(dir, 'delta.json');
    const configPath = join(dir, 'config.json');
    const outputPath = join(dir, 'portable.json');
    const config = JSON.parse(readFileSync('fixtures/telegram-intake-config.example.json', 'utf8'));
    writeFileSync(deltaPath, JSON.stringify({
      chat_id: 1234567890,
      previous_last_message_id: 4,
      proposed_last_message_id: 5,
      messages: [{ id: 5, sender_id: 1002, text: 'CRM review https://secret.example token abcdefghijklmnopqrstuvwxyz123456' }],
    }));
    writeFileSync(configPath, JSON.stringify(config));

    execFileSync(process.execPath, ['scripts/telegram-intake.mjs', deltaPath, configPath, outputPath]);
    const result = JSON.parse(readFileSync(outputPath, 'utf8'));
    expect(result.intake).toEqual({ scanned: 1, matched: 1, taskCount: 1 });
    expect(result.objects.vdaiInteractions[0].sourceRef).toBe('tg://chat/-1001234567890/message/5');
    expect(result.objects.vdaiInteractions[0].summary).toContain('[link]');
    expect(result.objects.vdaiInteractions[0].summary).toContain('[secret]');
    expect(JSON.stringify(result)).not.toContain('secret.example');
    expect(result.objects.vdaiTaskEvents[0].actorRef).toBe('sasha:l7');
  });

  it('rejects a non-allowlisted chat', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vdai-tg-'));
    const deltaPath = join(dir, 'delta.json');
    const configPath = join(dir, 'config.json');
    const config = JSON.parse(readFileSync('fixtures/telegram-intake-config.example.json', 'utf8'));
    writeFileSync(deltaPath, JSON.stringify({ chat_id: 999, messages: [] }));
    writeFileSync(configPath, JSON.stringify(config));
    expect(() => execFileSync(process.execPath, ['scripts/telegram-intake.mjs', deltaPath, configPath], { stdio: 'pipe' }))
      .toThrow(/Chat allowlist mismatch/);
  });
});
