# Human + agent collaboration model

VDAI OS uses a hybrid model. Full personal context stays with the participant and their agent. Shared work contains only a bounded context packet: project, request, allowed context, expected artifact, owner, gate and proof.

- Guest sees public documentation and synthetic data only.
- L5/L6 helper can submit a help or critique packet but cannot read the database or code by default.
- L7/L8 contributor may enter an explicitly isolated project after a named grant.
- Owner approves access and accepts, rejects or requests repair of each result.
- Support operator sees sanitized diagnostics, never credentials.

When supported record isolation is unavailable, unrelated sensitive projects must not share one trust boundary. The safe fallback is federation: agents exchange packets while each owner's full context remains local. A shared production workspace remains blocked until supported isolation, HTTPS, backup/restore and the production invite adapter all pass.
