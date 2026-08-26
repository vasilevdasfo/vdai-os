# Shared access deployment gate

This runbook prepares a shared VDAI OS address without publishing database,
Redis, Docker or the raw Twenty port.

## Required owner decisions

- approve one exact hostname, for example `os.vdai.me`;
- approve the DNS change and public HTTPS exposure;
- confirm the exact Sasha and Nikita email addresses;
- confirm Sasha = L7 Reviewer and Nikita = L6 Project Operator;
- decide whether access is invitation-only or additionally protected by an identity-aware proxy.

## Server contract

- Twenty listens only on `127.0.0.1:3040`;
- nginx listens on public ports 80/443 and proxies to `127.0.0.1:3040`;
- `SERVER_URL` is the exact approved HTTPS URL;
- PostgreSQL, Redis and Docker sockets remain private;
- firewall allows SSH from the approved administration path and public 80/443 only;
- TLS is valid before any invitation is sent.

Use `deploy/nginx-vdai.conf.example` as a reviewed template. Replace every
`os.example.com` occurrence with the approved hostname before installation.

## Pre-invite proof

From a device outside the server network, verify:

```bash
curl -fsSI https://<approved-hostname>/
curl -fsS https://<approved-hostname>/healthz
```

Then verify in a private browser window:

- signup is not open to uninvited users;
- an invited test user can authenticate;
- L6 cannot approve its own proof or manage access;
- L7 can review proof but cannot manage membership or grants;
- revoking the test user blocks the next login;
- audit events identify the actor and time.

## Invitation sequence

1. Create or verify the two narrow Twenty roles.
2. Invite Sasha to L7 Reviewer using the confirmed email.
3. Invite Nikita to L6 Project Operator using the confirmed email.
4. Grant access only to the named pilot project and set an expiry date.
5. Ask each person to set their own password; never share a common password.
6. Read back successful login and one blocked action per role.

Do not send invitations while `SERVER_URL` contains localhost, `127.0.0.1`, a
raw IP address, or an unverified certificate.
