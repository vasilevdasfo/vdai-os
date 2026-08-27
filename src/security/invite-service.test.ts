import { describe, expect, it } from 'vitest';
import { InMemoryInviteService, InviteRedemptionError, L8_ADMIN_PERMISSIONS } from './invite-service';

const issuedAt = new Date('2026-08-27T12:00:00.000Z');

describe('server-side single-use invites', () => {
  it('creates exactly one bound L8/admin member and rejects token reuse', () => {
    const service = new InMemoryInviteService();
    const invite = service.issueL8AdminInvite({ subject: 'test-dmitrii', ttlMs: 60_000, actor: 'local-test-steward', now: issuedAt });
    const member = service.redeem({ token: invite.token, actor: 'test-dmitrii', now: new Date(issuedAt.getTime() + 1_000) });
    expect(member).toMatchObject({ subject: 'test-dmitrii', level: 'L8', role: 'admin' });
    expect(service.members).toHaveLength(1);
    expect(() => service.redeem({ token: invite.token, actor: 'test-dmitrii', now: new Date(issuedAt.getTime() + 2_000) })).toThrow(new InviteRedemptionError('already_used'));
    expect(service.members).toHaveLength(1);
  });

  it('stores a token hash and never writes the token to audit events', () => {
    const service = new InMemoryInviteService();
    const invite = service.issueL8AdminInvite({ subject: 'test-dmitrii', ttlMs: 60_000, actor: 'local-test-steward', now: issuedAt });
    const stored = service.storedInviteForTest(invite.inviteId);
    service.redeem({ token: invite.token, actor: 'test-dmitrii', now: issuedAt });
    expect(() => service.redeem({ token: invite.token, actor: 'test-dmitrii', now: issuedAt })).toThrow(new InviteRedemptionError('already_used'));
    expect(stored?.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(stored?.tokenHash).not.toBe(invite.token);
    expect(JSON.stringify(service.auditEvents)).not.toContain(invite.token);
  });

  it('rejects expired and unknown tokens without creating a member', () => {
    const service = new InMemoryInviteService();
    const invite = service.issueL8AdminInvite({ subject: 'test-dmitrii', ttlMs: 1_000, actor: 'local-test-steward', now: issuedAt });
    expect(() => service.redeem({ token: invite.token, actor: 'test-dmitrii', now: new Date(issuedAt.getTime() + 1_000) })).toThrow(new InviteRedemptionError('expired'));
    expect(() => service.redeem({ token: 'not-a-real-token', actor: 'attacker', now: issuedAt })).toThrow(new InviteRedemptionError('invalid'));
    expect(service.members).toHaveLength(0);
  });

  it('binds role and level server-side and denies sensitive capabilities', () => {
    const service = new InMemoryInviteService();
    const invite = service.issueL8AdminInvite({ subject: 'test-dmitrii', ttlMs: 60_000, actor: 'local-test-steward', now: issuedAt });
    const member = service.redeem({ token: invite.token, actor: 'test-dmitrii', now: issuedAt });
    expect(member.level).toBe('L8');
    expect(member.role).toBe('admin');
    expect(member.permissions).toEqual(L8_ADMIN_PERMISSIONS);
    expect(member.permissions['secrets.read']).toBe(false);
    expect(member.permissions['payments.manage']).toBe(false);
    expect(member.permissions['production.access']).toBe(false);
    expect(member.permissions['client_data.read']).toBe(false);
  });
});
