# VDAI OS

VDAI OS is a project, task, collaboration and proof operating layer for VDAI Club. It is a separate Twenty application, not a fork of Twenty.

## What is open

- the VDAI application schema and eight access roles;
- a pinned self-hosted Twenty stack;
- synthetic demonstration data;
- installation, backup, restore and portable export tools;
- public safety and reproducibility checks.

Client data, credentials, paid policies, company-specific connectors and Bank OS are not stored here.

## Quick start

Prerequisites: Git, Docker Desktop (macOS/Windows) or Docker Engine with Compose (Linux), and Node.js 24 with pnpm 11 for application development.

```bash
git clone https://github.com/vasilevdasfo/vdai-os.git
cd vdai-os
./scripts/bootstrap.sh
```

Open `http://localhost:3000`, create the first workspace administrator, then follow `SETUP.md` to connect and install the VDAI application.

The guided public onboarding source is in `site/`. It explains the ten-minute
synthetic demo, Mac and Windows setup, read-only server preflight, the hybrid
human-plus-agent collaboration model and the Telegram support boundary. Until
the candidate release is tagged and independently verified, use the repository
for review and do not present a branch URL as a stable download.

```bash
pnpm release:verify
pnpm site:verify
./scripts/server-preflight.sh /tmp/vdai-server-preflight.json
```

## Security boundary

Club level and project access are independent. Effective access is the lower of the member level and the named project grant. Secrets, payments, production, client data and external sends always require a separate permission and human gate.

## Architecture

```text
VDAI UI and domain contract
        ↓
Twenty App API adapter
        ↓
Twenty upstream (replaceable CRM core)
        ↓
PostgreSQL + local object storage
```

VDAI uses portable identifiers in its own objects. It does not read or modify Twenty's internal database tables directly.

## License

VDAI OS application code is MIT licensed. Twenty is a separate upstream dependency with its own AGPL, Application Exception, MIT-package and commercial-file terms. See `NOTICE`.
