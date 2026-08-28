export type ProductionInviteGate = {
  enabled: boolean;
  httpsVerified: boolean;
  supportedIsolationVerified: boolean;
  backupRestoreVerified: boolean;
  namedSubject: boolean;
};

export function authorizeProductionInvite(gate: ProductionInviteGate): { ok: true } | { ok: false; reason: string } {
  if (!gate.enabled) return { ok: false, reason: 'adapter_disabled' };
  if (!gate.httpsVerified) return { ok: false, reason: 'https_not_verified' };
  if (!gate.supportedIsolationVerified) return { ok: false, reason: 'supported_isolation_not_verified' };
  if (!gate.backupRestoreVerified) return { ok: false, reason: 'backup_restore_not_verified' };
  if (!gate.namedSubject) return { ok: false, reason: 'named_subject_required' };
  return { ok: true };
}
