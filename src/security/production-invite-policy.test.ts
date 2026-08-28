import { describe, expect, it } from 'vitest';
import { authorizeProductionInvite } from './production-invite-policy';

const passed = { enabled: true, httpsVerified: true, supportedIsolationVerified: true, backupRestoreVerified: true, namedSubject: true };
describe('production invite policy', () => {
  it('is disabled by default', () => expect(authorizeProductionInvite({ ...passed, enabled: false })).toEqual({ ok: false, reason: 'adapter_disabled' }));
  it.each(['httpsVerified','supportedIsolationVerified','backupRestoreVerified','namedSubject'] as const)('fails closed when %s is absent', (key) => expect(authorizeProductionInvite({ ...passed, [key]: false }).ok).toBe(false));
  it('permits only a fully proved gate', () => expect(authorizeProductionInvite(passed)).toEqual({ ok: true }));
});
