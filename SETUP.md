# Setup and operations

## Local company installation

### macOS or Windows

- Install Docker Desktop and confirm that Docker is running.
- Clone this repository.
- Run `./scripts/bootstrap.sh` from Git Bash, WSL, or a Unix-compatible terminal.
- Open `http://localhost:3000` and create the first workspace administrator.

### Ubuntu Linux

- Install Docker Engine and the Docker Compose plugin from Docker's official repository.
- Add the operator to the Docker group only if your security policy permits it; Docker access is effectively host-root access.
- Clone the repository and run `./scripts/bootstrap.sh`.

## Install the VDAI application

The Twenty application tool uses OAuth for a running workspace. With Node.js 24 available:

```bash
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm twenty remote:add --url http://localhost:3000
pnpm twenty apply
```

The browser OAuth page must show the same local Twenty instance. Review the permissions before approval. The VDAI default function role has no global data access.

## Load the synthetic demonstration

- In Twenty, create a dedicated API key assigned to the narrowest VDAI role needed for import.
- Keep the key only in the terminal environment.
- Validate first, then explicitly apply:

```bash
node scripts/import-portable.mjs fixtures/demo-portable.json
TWENTY_API_URL=http://localhost:3000 TWENTY_API_KEY='<temporary-key>' node scripts/import-portable.mjs fixtures/demo-portable.json --apply
```

Revoke the temporary import key after use.

## Backup, restore and export

```bash
./scripts/backup.sh
TWENTY_API_URL=http://localhost:3000 TWENTY_API_KEY='<read-only-key>' node scripts/export-portable.mjs
./scripts/restore.sh --confirm backups/<verified-file>.sql
```

Restore is intentionally gated and accepts only files inside this repository's ignored `backups` directory. Test restore on a separate instance before relying on it for production recovery.

## Update and rollback

- Back up the database and export portable VDAI records.
- Change the Twenty image only to a tested version and digest in a review branch.
- Run application unit, type, manifest and clean-install checks.
- Keep the previous compose revision and backup until business readback passes.
- Roll back by restoring the previous compose revision and its compatible database backup.

## Full removal

`docker compose down` stops the system but preserves data. `docker compose down --volumes` permanently deletes the local database and file volumes; run it only after a verified export/backup and explicit owner approval.
