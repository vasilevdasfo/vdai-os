export type TelegramIdentityBinding = {
  accountId: string;
  telegramUserId: string;
  linkedAt: string;
  usernameAtLink?: string;
};

export type VerifiedTelegramIdentity = {
  userId: string | number;
  verifiedAt: string;
  username?: string;
};

export class TelegramLoginError extends Error {}

function canonicalTelegramUserId(value: string | number): string {
  const result = String(value);
  if (!/^[1-9]\d{4,19}$/.test(result)) throw new TelegramLoginError('Telegram user id must be a canonical positive numeric id.');
  return result;
}

export function linkTelegramIdentity(input: {
  accountId: string;
  emailSessionVerified: boolean;
  telegram: VerifiedTelegramIdentity;
  now: string;
  bindings: TelegramIdentityBinding[];
}): TelegramIdentityBinding {
  if (!input.emailSessionVerified) {
    throw new TelegramLoginError('An authenticated recovery account is required before linking Telegram.');
  }
  const telegramUserId = canonicalTelegramUserId(input.telegram.userId);
  const now = Date.parse(input.now);
  const verifiedAt = Date.parse(input.telegram.verifiedAt);
  if (!Number.isFinite(now) || !Number.isFinite(verifiedAt) || Math.abs(now - verifiedAt) > 5 * 60_000) {
    throw new TelegramLoginError('Telegram verification is stale.');
  }
  const collision = input.bindings.find((binding) => binding.telegramUserId === telegramUserId && binding.accountId !== input.accountId);
  if (collision) throw new TelegramLoginError('Telegram identity is already linked to another account.');
  const accountBinding = input.bindings.find((binding) => binding.accountId === input.accountId);
  if (accountBinding && accountBinding.telegramUserId !== telegramUserId) {
    throw new TelegramLoginError('Account already has another Telegram identity. Re-link requires explicit revocation.');
  }
  return accountBinding ?? {
    accountId: input.accountId,
    telegramUserId,
    linkedAt: input.now,
    usernameAtLink: input.telegram.username,
  };
}

export function resolveTelegramLogin(input: {
  telegram: VerifiedTelegramIdentity;
  now: string;
  bindings: TelegramIdentityBinding[];
}): { accountId: string } {
  const telegramUserId = canonicalTelegramUserId(input.telegram.userId);
  const now = Date.parse(input.now);
  const verifiedAt = Date.parse(input.telegram.verifiedAt);
  if (!Number.isFinite(now) || !Number.isFinite(verifiedAt) || Math.abs(now - verifiedAt) > 5 * 60_000) {
    throw new TelegramLoginError('Telegram verification is stale.');
  }
  const binding = input.bindings.find((candidate) => candidate.telegramUserId === telegramUserId);
  if (!binding) throw new TelegramLoginError('Telegram identity is not linked. Use the recovery login first.');
  return { accountId: binding.accountId };
}
