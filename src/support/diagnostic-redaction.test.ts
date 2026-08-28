import { describe, expect, it } from 'vitest';
import { classifyDiagnostic, sanitizeDiagnostic } from './diagnostic-redaction';

describe('support diagnostics', () => {
  it('redacts secrets and connection strings', () => {
    const clean = sanitizeDiagnostic('API_KEY=abcd1234 postgres://vdai:secret@db:5432/vdai');
    expect(clean).not.toContain('abcd1234');
    expect(clean).not.toContain('secret@db');
    expect(clean).toContain('[REDACTED]');
  });
  it('classifies only the supported next-action lane', () => {
    expect(classifyDiagnostic('Cannot connect to the Docker daemon')).toBe('docker');
    expect(classifyDiagnostic('address already in use on port 3000')).toBe('ports');
    expect(classifyDiagnostic('localhost works but invite does not')).toBe('shared_access');
  });
});
