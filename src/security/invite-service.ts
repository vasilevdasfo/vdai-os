import { createHash, randomBytes, randomUUID } from 'node:crypto';

export type Permission = 'vdai.objects.manage' | 'vdai.access_rules.manage' | 'secrets.read' | 'payments.manage' | 'production.access' | 'client_data.read';

export const L8_ADMIN_PERMISSIONS: Readonly<Record<Permission, boolean>> = {
  'vdai.objects.manage': true,
  'vdai.access_rules.manage': true,
  'secrets.read': false,
  'payments.manage': false,
  'production.access': false,
  'client_data.read': false,
};

type InviteRecord = { id: string; tokenHash: string; subject: string; level: 'L8'; role: 'admin'; expiresAt: Date; usedAt: Date | null };
export type InviteAuditEvent = { type: 'invite.created' | 'invite.redeemed' | 'invite.rejected'; inviteId: string; actor: string; timestamp: string; reason?: 'expired' | 'already_used' | 'invalid' };
export type RegisteredMember = { id: string; subject: string; level: 'L8'; role: 'admin'; permissions: Readonly<Record<Permission, boolean>> };

export class InviteRedemptionError extends Error {
  constructor(public readonly reason: 'expired' | 'already_used' | 'invalid') {
    super(`Invite redemption rejected: ${reason}`);
  }
}

const hashToken = (token: string) => createHash('sha256').update(token, 'utf8').digest('hex');

export class InMemoryInviteService {
  readonly auditEvents: InviteAuditEvent[] = [];
  readonly members: RegisteredMember[] = [];
  private readonly invitesByHash = new Map<string, InviteRecord>();

  issueL8AdminInvite(input: { subject: string; ttlMs: number; actor: string; now?: Date }) {
    if (input.ttlMs <= 0) throw new Error('ttlMs must be positive');
    const now = input.now ?? new Date();
    const token = randomBytes(32).toString('base64url');
    const invite: InviteRecord = { id: randomUUID(), tokenHash: hashToken(token), subject: input.subject, level: 'L8', role: 'admin', expiresAt: new Date(now.getTime() + input.ttlMs), usedAt: null };
    this.invitesByHash.set(invite.tokenHash, invite);
    this.auditEvents.push({ type: 'invite.created', inviteId: invite.id, actor: input.actor, timestamp: now.toISOString() });
    return { inviteId: invite.id, token, expiresAt: invite.expiresAt.toISOString() };
  }

  redeem(input: { token: string; actor: string; now?: Date }): RegisteredMember {
    const now = input.now ?? new Date();
    const invite = this.invitesByHash.get(hashToken(input.token));
    if (!invite) return this.reject('invalid', 'unknown', input.actor, now);
    if (invite.usedAt) return this.reject('already_used', invite.id, input.actor, now);
    if (invite.expiresAt.getTime() <= now.getTime()) return this.reject('expired', invite.id, input.actor, now);

    // Role and level come only from the server-side record. The redeem API
    // accepts neither field, so caller-controlled URL parameters cannot alter them.
    const member: RegisteredMember = { id: randomUUID(), subject: invite.subject, level: invite.level, role: invite.role, permissions: { ...L8_ADMIN_PERMISSIONS } };
    invite.usedAt = now;
    this.members.push(member);
    this.auditEvents.push({ type: 'invite.redeemed', inviteId: invite.id, actor: input.actor, timestamp: now.toISOString() });
    return member;
  }

  storedInviteForTest(inviteId: string) {
    const invite = [...this.invitesByHash.values()].find(({ id }) => id === inviteId);
    return invite ? { ...invite } : undefined;
  }

  private reject(reason: 'expired' | 'already_used' | 'invalid', inviteId: string, actor: string, now: Date): never {
    this.auditEvents.push({ type: 'invite.rejected', inviteId, actor, timestamp: now.toISOString(), reason });
    throw new InviteRedemptionError(reason);
  }
}
