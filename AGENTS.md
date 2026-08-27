## Base documentation

- Getting started:
  - https://docs.twenty.com/developers/extend/apps/getting-started/quick-start.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/concepts.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/project-structure.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/local-server.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/scaffolding.md
  - https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting.md
- Config:
  - https://docs.twenty.com/developers/extend/apps/config/overview.md
  - https://docs.twenty.com/developers/extend/apps/config/application.md
  - https://docs.twenty.com/developers/extend/apps/config/roles.md
  - https://docs.twenty.com/developers/extend/apps/config/install-hooks.md
  - https://docs.twenty.com/developers/extend/apps/config/public-assets.md
- Data:
  - https://docs.twenty.com/developers/extend/apps/data/overview.md
  - https://docs.twenty.com/developers/extend/apps/data/objects.md
  - https://docs.twenty.com/developers/extend/apps/data/extending-objects.md
  - https://docs.twenty.com/developers/extend/apps/data/relations.md
- Logic:
  - https://docs.twenty.com/developers/extend/apps/logic/overview.md
  - https://docs.twenty.com/developers/extend/apps/logic/logic-functions.md
  - https://docs.twenty.com/developers/extend/apps/logic/skills-and-agents.md
  - https://docs.twenty.com/developers/extend/apps/logic/connections.md
- Layout:
  - https://docs.twenty.com/developers/extend/apps/layout/overview.md
  - https://docs.twenty.com/developers/extend/apps/layout/views.md
  - https://docs.twenty.com/developers/extend/apps/layout/navigation-menu-items.md
  - https://docs.twenty.com/developers/extend/apps/layout/page-layouts.md
  - https://docs.twenty.com/developers/extend/apps/layout/front-components.md
  - https://docs.twenty.com/developers/extend/apps/layout/command-menu-items.md
- Operations:
  - https://docs.twenty.com/developers/extend/apps/operations/overview.md
  - https://docs.twenty.com/developers/extend/apps/operations/cli.md
  - https://docs.twenty.com/developers/extend/apps/operations/testing.md
  - https://docs.twenty.com/developers/extend/apps/operations/publishing.md
- Rich app example: https://github.com/twentyhq/twenty/tree/main/packages/twenty-apps/examples/postcard

## UUID requirement

- All generated UUIDs must be valid UUID v4.

## VDAI OS economy contract

This is a workflow constraint of the existing VDAI OS MAIN, not a second
registry, dashboard, bot, or operating system.

- Default: one primary agent, one exact outcome, one pass, and low reasoning
  for routine build, triage, cleanup, status, extraction, registry work, and
  simple comparisons. No subagents, SOS1/SOS2, broad research, or expensive
  model unless Dmitrii explicitly requests it or independent bounded work is
  genuinely parallel and the error cost justifies fan-out.
- Ordinary-request budget: at most 8 model/tool steps and 2 repeats of the same
  operation. Use one project, one exact capsule, and one proof-result. Deploy,
  browser QA, external research, and external send are separate passes and
  separate gates.
- Checkpoint: stop expanding at 40 steps, cumulative input over 2M tokens, or
  two consecutive model calls over 100k input. Preserve proof, update one short
  capsule, and continue only in a new addressed task. Emergency closeout at
  100 steps, cumulative input over 10M, or repeated compaction without a closed
  result. SOS2 and long goals checkpoint no later than 25 steps.
- Context start: read only this project guidance, one exact capsule, and the
  selected module/file. Open the full source chat, vault, session archive, or
  broad directories only for a contradiction, missing proof, or direct request.
  A capsule contains outcome, source of truth, constraints/gates, accepted
  decision, current proof, unfinished work, next verifiable step, and its
  `codex://` source link. Keep cache enabled; savings come from smaller repeated
  context and less fan-out, not from disabling cached input.
- Preflight contract: record outcome, source of truth, constraints/external
  gates, definition of done, proof plan, and what remains manual. Narrow work
  that does not fit instead of loading more context.
- Tools: exact local `rg` first, then read-only diagnosis; web only for changing
  or external facts. Do not reread unchanged files. Run the targeted test first,
  then a proportional check. After the same blocker twice, stop retrying and
  change the diagnostic path.
- Models/backgrounds: use the cheap/default model with low reasoning. Escalate
  only when at least two apply: high stakes, proven quality loss, complex
  synthesis, no cheaper rules/local path, or value justifies cost. Escalate only
  the broken diagnostic step. Prefer one-shot; recurring work requires owner,
  measurable outcome, value, budget, stop-rule, and independent proof, otherwise
  pause it.
- Monitor with `python3 ~/.codex/skills/economy-guard/scripts/check_overspend.py
  --thread-id <thread_id>` or the summary-only `--all-threads --limit 0`.
  Localhost, UI state, or HTTP 200 is not production, delivery, or real access.

## Common Pitfalls

- Creating a view without a navigationMenuItem associated. This will make the view available on the left sidebar.
- Creating a front-end component that has a scroll instead of being responsive to its fixed widget height and width, unless it is specifically meant to be used in a canvas tab.

## Best practice

It's highly recommended to create new app entities using `yarn twenty dev:add`. These are the options:

| Entity type          | Command                                  | Generated file                        |
| -------------------- | ---------------------------------------- | ------------------------------------- |
| Object               | `yarn twenty dev:add object`             | `src/objects/<name>.ts`               |
| Field                | `yarn twenty dev:add field`              | `src/fields/<name>.ts`                |
| Logic function       | `yarn twenty dev:add logicFunction`      | `src/logic-functions/<name>.ts`       |
| Front component      | `yarn twenty dev:add frontComponent`     | `src/front-components/<name>.tsx`     |
| Role                 | `yarn twenty dev:add role`               | `src/roles/<name>.ts`                 |
| Skill                | `yarn twenty dev:add skill`              | `src/skills/<name>.ts`                |
| Agent                | `yarn twenty dev:add agent`              | `src/agents/<name>.ts`                |
| View                 | `yarn twenty dev:add view`               | `src/views/<name>.ts`                 |
| Navigation menu item | `yarn twenty dev:add navigationMenuItem` | `src/navigation-menu-items/<name>.ts` |
| Page layout          | `yarn twenty dev:add pageLayout`         | `src/page-layouts/<name>.ts`          |
| Page layout tab      | `yarn twenty dev:add pageLayoutTab`      | `src/page-layout-tabs/<name>.ts`      |
| Command menu item    | `yarn twenty dev:add commandMenuItem`    | `src/command-menu-items/<name>.ts`    |
| View field           | `yarn twenty dev:add viewField`          | `src/view-fields/<name>.ts`           |
| Connection provider  | `yarn twenty dev:add connectionProvider` | `src/connection-providers/<name>.ts`  |

This helps automatically generate required IDs etc.
