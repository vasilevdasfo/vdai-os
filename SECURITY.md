# Security policy

## Supported version

Only the latest tagged VDAI OS release is supported. The tested Twenty version and image digest are recorded in `compose.yaml` and `NOTICE`.

## Data and secrets

- Never commit `.env`, API keys, database dumps, exports, client names, chats, recordings or production URLs.
- Browser code must not contain credentials; anything available to a front component is visible to the user.
- Use short-lived, role-scoped API keys for import/export and revoke them after use.
- Database and Redis are internal Compose services and are not published to the host.
- L8 is not permission to access secrets, money, production, client data or external communications.

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
