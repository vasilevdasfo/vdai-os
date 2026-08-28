# VDAI OS support adapter

The canonical public bot is `@vdai_club_bot`. VDAI OS reuses it; no second bot or task registry is created.

Supported start payloads are `os_mac`, `os_windows`, `os_server` and `os_install_error`. The adapter collects only platform, release version, current step, sanitized error category and optional screenshot. It must reject or redact passwords, API keys, tokens, seed phrases, `.env` contents and connection strings.

The first failure returns one supported next action. A repeated failure creates a `Help Request` linked to the install session and routes it for human review. The bot never runs commands, deploys, deletes, changes DNS, issues invitations or marks the installation complete without a user proof receipt.
