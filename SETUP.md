# Setup and operations

## Local company installation

### macOS or Windows

- Install Docker Desktop and confirm that Docker is running.
- Clone this repository.
- Run `./scripts/bootstrap.sh` from Git Bash, WSL, or a Unix-compatible terminal.
- Open `http://localhost:3000` and create the first workspace administrator.

On macOS/Linux, `scripts/bootstrap.sh` now runs `scripts/local-preflight.sh`,
waits for the local health endpoint and writes a sanitized local proof receipt
to the ignored `runtime/` directory. The receipt explicitly records that
shared access was not proved.

For Windows, run the read-only preflight from PowerShell after cloning:

```powershell
.\scripts\windows-preflight.ps1
```

If dependencies are missing, an administrator may explicitly run `.\scripts\windows-preflight.ps1 -Install`, restart when Docker Desktop requests it, and rerun the preflight. The script installs no VDAI credentials or secrets.

### Ubuntu Linux

- Install Docker Engine and the Docker Compose plugin from Docker's official repository.
- Add the operator to the Docker group only if your security policy permits it; Docker access is effectively host-root access.
- Clone the repository and run `./scripts/bootstrap.sh`.

Before any server planning, run the read-only inventory. Exit code `3` means
the host does not meet the pilot profile; it does not authorize a repair:

```bash
./scripts/server-preflight.sh /tmp/vdai-server-preflight.json
```

Unknown services are never cleanup authorization. Classify them, snapshot the
exact targets and obtain owner approval before any delete, resize, DNS, deploy,
root or invitation action.

## Install the VDAI application

The Twenty application tool uses OAuth for a running workspace. With Node.js 24 available:

```bash
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm twenty remote:add --url http://localhost:3000
pnpm twenty apply
```

The browser OAuth page must show the same local Twenty instance. Review the permissions before approval. The VDAI default function role has no global data access.

## Shared team access

### Choose the collaboration mode first

- **Local contributor mode:** every contributor runs the same GitHub revision
  on their own computer. Git branches and pull requests synchronize code and
  schema, but each localhost keeps an independent test database. CRM records,
  comments and memberships do not synchronize automatically between laptops.
- **Shared workspace mode:** contributors use one HTTPS-hosted Twenty instance
  and therefore one database. Use this only after hosting, record isolation,
  roles, backup and invitation gates have passed.

Do not provision a shared server merely to review or develop code. Do not call
two local instances a shared CRM.

Do not send team invitations to a localhost or SSH-forwarded URL. For a shared
company instance, complete the owner gates and external readback in
`docs/SHARED_ACCESS.md`. Keep Twenty bound to loopback, terminate TLS at a
reviewed reverse proxy, and set `SERVER_URL` to the exact approved HTTPS
hostname.

## Load the synthetic demonstration

- In Twenty, create a dedicated API key assigned to the narrowest VDAI role needed for import.
- Keep the key only in the terminal environment.
- Validate first, then explicitly apply:

```bash
node scripts/import-portable.mjs fixtures/demo-portable.json
TWENTY_API_URL=http://localhost:3000 TWENTY_API_KEY='<temporary-key>' node scripts/import-portable.mjs fixtures/demo-portable.json --apply
```

For the synthetic ProblemOS end-to-end scenario, use `fixtures/problemos-demo-portable.json` in the same two commands. Repeating an import is safe: records with the same portable identity are skipped.

Verify every fixture field by reading the records back from Twenty:

```bash
TWENTY_API_URL=http://localhost:3000 TWENTY_API_KEY='<temporary-key>' node scripts/import-portable.mjs fixtures/problemos-demo-portable.json --verify
```

## ProblemOS bridge

Convert the strict six-event synthetic contract into a portable VDAI payload:

```bash
node scripts/problemos-bridge.mjs fixtures/problemos-events.json --output runtime/problemos-portable.json
node scripts/import-portable.mjs runtime/problemos-portable.json
TWENTY_API_URL=http://localhost:3000 TWENTY_API_KEY='<temporary-key>' node scripts/import-portable.mjs runtime/problemos-portable.json --apply
TWENTY_API_URL=http://localhost:3000 TWENTY_API_KEY='<temporary-key>' node scripts/import-portable.mjs runtime/problemos-portable.json --verify
```

The bridge accepts only synthetic records, the fixed event order, seven declared fields, opaque payload references and an independent L7 proof actor. It never reads Telegram messages or writes directly to the Twenty database.

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
