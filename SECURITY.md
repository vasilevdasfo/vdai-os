# Security policy

## Supported version

Only the latest tagged VDAI OS release is supported. The tested Twenty version and image digest are recorded in `compose.yaml` and `NOTICE`.

## Data and secrets

- Never commit `.env`, API keys, database dumps, exports, client names, chats, recordings or production URLs.
- Browser code must not contain credentials; anything available to a front component is visible to the user.
- Use short-lived, role-scoped API keys for import/export and revoke them after use.
- Database and Redis are internal Compose services and are not published to the host.
- L8 is not permission to access secrets, money, production, client data or external communications.

## Local invite contract

The server-side invite service issues opaque, single-use tokens. Only a SHA-256 token hash is retained; the raw token is returned once and never written to audit events. Expiry, level, role and subject are stored with the invite record. Redemption accepts only the token and actor, so query parameters cannot elevate the bound `L8/admin` assignment.

The current local adapter is intentionally in-memory. A production adapter must preserve this contract with an atomic `unused -> used` transaction and remains behind the separate production/deploy gate.

VDAI OS keeps a recovery login (email today) and may add Telegram as a second login method. Telegram is linked only after an authenticated recovery session and only by the verified immutable numeric Telegram user ID; `@username`, phone number and profile name are metadata, never identity keys. A Telegram login resolves an existing account and cannot create or elevate a role, grant project access, or bypass a single-use invite. Re-linking requires explicit revocation and an audit event.

The current Twenty core supports email plus documented Google/Microsoft authentication; Telegram login therefore requires a reviewed HTTPS callback/gateway. The repository contains the server-side identity-binding contract, not a claim that the local `localhost` UI already exposes a Telegram login button. Bot credentials and callback domains remain owner-gated.

| L8/admin permission | Result |
|---|---|
| Manage VDAI objects | allowed |
| Manage VDAI access rules | allowed |
| Read secrets | denied |
| Manage payments | denied |
| Access production | denied |
| Read client data | denied |

## Reporting

Do not open a public issue containing exploit details or private data. Send a minimal private report to the repository owner through GitHub's private vulnerability reporting when enabled.

## Production checklist

- terminate TLS at a reviewed reverse proxy;
- set production security headers and verify them at runtime;
- use managed secret storage and encrypted off-host backups;
- restrict Docker and server access;
- assign users and API keys to the minimum Twenty role;
- test backup restoration and access revocation;
- review upstream Twenty security notices before every upgrade.
- keep the raw Twenty port bound to loopback; expose only the TLS reverse proxy;
- disable open signup before sending named invitations;
- verify one denied action for every non-admin role before admitting real data.
