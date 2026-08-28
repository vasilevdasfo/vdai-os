export type SupportCategory = 'prerequisites' | 'docker' | 'ports' | 'bootstrap' | 'application_apply' | 'login' | 'shared_access' | 'unknown';

const SECRET_PATTERNS = [
  /\b(?:api[_ -]?key|token|password|secret|seed phrase|private key)\b\s*[:=]\s*\S+/gi,
  /\b(?:postgres(?:ql)?|redis):\/\/\S+/gi,
  /\b[A-Za-z0-9_-]{24,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{20,}\b/g,
  /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g,
];

export function sanitizeDiagnostic(input: string): string {
  let output = input.slice(0, 8_000);
  for (const pattern of SECRET_PATTERNS) output = output.replace(pattern, '[REDACTED]');
  return output.replace(/\0/g, '').trim();
}

export function classifyDiagnostic(input: string): SupportCategory {
  const text = input.toLowerCase();
  if (/docker|daemon|compose|container/.test(text)) return 'docker';
  if (/port|address already in use|eaddrinuse/.test(text)) return 'ports';
  if (/git|node|pnpm|openssl|prerequisite|not found/.test(text)) return 'prerequisites';
  if (/bootstrap|\.env|healthz/.test(text)) return 'bootstrap';
  if (/twenty apply|oauth|application/.test(text)) return 'application_apply';
  if (/login|sign in|authentication/.test(text)) return 'login';
  if (/https|shared|invite|localhost|dns/.test(text)) return 'shared_access';
  return 'unknown';
}
