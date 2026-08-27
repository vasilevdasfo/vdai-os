import { describe, expect, it } from 'vitest';
import { linkTelegramIdentity, resolveTelegramLogin, TelegramLoginError } from './telegram-login-service';

const now = '2026-08-27T20:00:00.000Z';
const telegram = { userId: 1034933692, verifiedAt: now, username: 'bosswor' };

describe('Telegram login identity binding', () => {
  it('links a verified numeric Telegram id to an existing recovery account', () => {
    const binding = linkTelegramIdentity({ accountId: 'account-sasha', emailSessionVerified: true, telegram, now, bindings: [] });
    expect(binding).toMatchObject({ accountId: 'account-sasha', telegramUserId: '1034933692' });
    expect(resolveTelegramLogin({ telegram: { ...telegram, username: 'renamed' }, now, bindings: [binding] }))
      .toEqual({ accountId: 'account-sasha' });
  });

  it('never treats username as identity and requires recovery login for linking', () => {
    expect(() => linkTelegramIdentity({ accountId: 'account-sasha', emailSessionVerified: false, telegram, now, bindings: [] }))
      .toThrow(TelegramLoginError);
    expect(() => resolveTelegramLogin({ telegram: { ...telegram, userId: '@bosswor' }, now, bindings: [] }))
      .toThrow(/numeric id/);
  });

  it('rejects stale assertions, collisions and silent re-linking', () => {
    const existing = [{ accountId: 'other', telegramUserId: '1034933692', linkedAt: now }];
    expect(() => linkTelegramIdentity({ accountId: 'account-sasha', emailSessionVerified: true, telegram, now, bindings: existing }))
      .toThrow(/another account/);
    expect(() => resolveTelegramLogin({ telegram: { ...telegram, verifiedAt: '2026-08-27T19:00:00.000Z' }, now, bindings: existing }))
      .toThrow(/stale/);
  });
});
