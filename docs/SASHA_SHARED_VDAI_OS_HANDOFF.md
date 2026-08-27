# Саша × Дмитрий · VDAI OS — пакет совместной работы

Дата состояния: 2026-08-27  
Режим передачи: `bounded contribution`  
Trust: `P3 × R2 = T2`  
Source of truth: один репозиторий VDAI OS и одна общая серверная CRM.

## Зачем проект

VDAI OS — общий операционный слой клуба и совместных проектов:

`сообщение/созвон → решение → задача → owner → комментарии/помощь → proof → журнал изменений`

Цель не в том, чтобы у Дмитрия и Саши были две локальные CRM. Рабочие данные
должны жить в одной PostgreSQL-базе на существующем сервере. GitHub хранит и
синхронизирует код и схему; проекты, задачи, комментарии, memberships, grants и
audit events создаются в общей CRM.

Локальный запуск на Windows остаётся только средой разработки и проверки PR.
Сливать разные локальные базы не планируется.

## Где текущее состояние

- Репозиторий: https://github.com/vasilevdasfo/vdai-os
- Актуальная рабочая ветка: `codex/sasha-collaboration-intake`
- Ветка в GitHub: https://github.com/vasilevdasfo/vdai-os/tree/codex/sasha-collaboration-intake
- Версия приложения: `0.1.0`
- Проверенный commit: `cd89d4cbdbf5`
- Twenty: `v2.35.0`, image закреплён digest в `compose.yaml`
- Portable data contract: `vdai-portable-v1`
- Identity: `externalId/sourceRef`, никогда не позиция строки.

## Что уже разработано

### Модель данных

- Workspace, Project, Task;
- Task Comment и Task Event;
- Interaction и Help Request;
- Proof;
- Membership и Project Grant;
- Automation.

### Доступ

- Восемь ролей L1–L8.
- Club level и project grant независимы.
- Effective access = пересечение workspace role, membership и активного grant
  конкретного проекта.
- L7 Reviewer не управляет memberships/grants и не получает destructive access.
- L8 не получает автоматически secrets, payments, production или client data.
- Hard delete не входит в обычный контур.

### Безопасность и вход

- Локальная server-side single-use invite-механика:
  - opaque token;
  - хранится только SHA-256 hash;
  - expiry;
  - level/role привязаны на сервере и не принимаются из URL;
  - повторное применение отклоняется;
  - audit содержит invite ID, actor и time, но не raw token.
- Telegram identity-binding contract:
  - Telegram — второй способ входа, а не единственный recovery-канал;
  - привязка только после подтверждённой email-сессии;
  - identity = immutable numeric Telegram user ID;
  - username/телефон/имя не дают права;
  - Telegram login не создаёт пользователя и не повышает роль.
- Project-scoped comments с idempotency key и audit event.

### Совместная работа и синхронизация

- `docs/CENTRAL_SYNC.md` — одна серверная CRM и потоки данных.
- `docs/VERSIONING_AND_SYNC.md` — раздельные версии кода, схемы, данных и
  истории.
- Telegram intake с allowlist, redaction, checkpoint и дедупликацией по
  `sourceRef`.
- Portable import/export с validate/apply/verify.
- ProblemOS bridge работает только на synthetic fixtures и не пишет напрямую
  во внутренние таблицы Twenty.
- Windows preflight/bootstrap для локальной разработки.
- Backup/restore scripts и nginx-template для будущего shared deployment.

## Что проверено

- `pnpm version:report` показывает commit `cd89d4cbdbf5`, clean tree и
  `vdai-portable-v1`.
- Unit proof: 9 test files, 21 tests — PASS.
- Invite tests доказывают первую регистрацию, повторный отказ, expiry, role
  binding, отсутствие token value в audit и denied permissions.
- Центральная модель синхронизации, version readback, Telegram intake,
  comments, Telegram binding, ProblemOS bridge и Windows runbook покрыты
  локальными тестами.
- L7 сейчас fail-closed: без доказанного project RLS доступ не выдаётся.

## Что пока НЕ доказано

- Общий HTTPS workspace ещё не запущен и не принят с внешнего устройства.
- `os.vdai.me` не является подтверждённым live CRM.
- Реальный login Саши, named invite, revoke и один allowed/denied action не
  выполнены.
- Server-side invite пока использует in-memory adapter; production требует
  PostgreSQL adapter с атомарным `unused → used`.
- В текущей Twenty-конфигурации project row-level permission feature отключена
  entitlement-ограничением. Ослаблять права нельзя; нужен поддерживаемый
  fail-closed вариант.
- Сервер существует, но последний read-only snapshot показал около 1 ГБ
  доступной RAM и отсутствие swap. Полный Docker/Nginx readback требует
  согласованного admin-доступа. Bank OS затрагивать или смешивать запрещено.
- Локальный `localhost`, контейнер и HTTP 200 не доказывают общий доступ,
  delivery или production.

## Предлагаемая архитектура общего контура

```text
Дмитрий / Саша / Telegram intake
              ↓ HTTPS
       reverse proxy + TLS
              ↓
       VDAI OS / Twenty
              ↓
   отдельные PostgreSQL + Redis + volumes
              ↓
      backup + audit/event log
```

VDAI OS разворачивается отдельным Compose-проектом и не делит database/volumes
с Bank OS. Raw Twenty port, PostgreSQL, Redis и Docker socket наружу не
публикуются.

Полную децентрализацию сейчас не строим. Чтобы оставить путь к hybrid/offline
режиму, сохраняем portable UUID, append-only events, sourceRef и конфликтную
остановку вместо blind last-write-wins.

## Задача Саше

Нужна не только критика, а инженерное участие в существующем MAIN.

Первый bounded outcome:

1. Просмотреть рабочую ветку и этот пакет.
2. Дать архитектурное решение, как безопасно поднять одну общую базу на
   существующем сервере при текущем ограничении RAM и полной изоляции Bank OS.
3. Выбрать и обосновать один маршрут:
   - resize/освобождение ресурсов и отдельный Compose stack;
   - отдельный runtime/VM при сохранении одного MAIN;
   - другой простой вариант без двух рабочих баз.
4. В существующей ветке или отдельном PR подготовить только выбранный
   server-ready delta: compose override/runbook/health/backup/rollback и
   production PostgreSQL invite adapter. Не создавать второй репозиторий,
   CRM, бот, bridge или MAIN.
5. Вернуть:
   - что берёшь на себя;
   - архитектурные замечания;
   - ветку/PR;
   - команды целевой проверки;
   - ожидаемый расход RAM;
   - rollback;
   - какие действия требуют Дмитрия/admin gate.

## Acceptance общего пилота

- Один HTTPS workspace и одна база.
- Дмитрий и Саша видят один и тот же тестовый проект и одну задачу.
- Комментарий Саши появляется у Дмитрия без Git/import базы.
- Изменение создаёт audit event с actor/time/source.
- Саша получает только L7 + grant одного тестового проекта.
- Один разрешённый L7 action проходит; memberships/grants/secrets/payments/
  production/client data остаются denied.
- Revoke блокирует следующий вход.
- Backup и rollback проверены в изолированном тесте.
- Повторный запуск после reboot работает.
- Bank OS не изменена.

## Границы

В этот пакет не входят пароли, токены, 2FA, SSH keys, `.env`, Telegram session,
production dump, реальные переписки или client data. Не отправлять invites, не
менять DNS, не выполнять deploy и не входить на сервер без отдельного точного
согласования Дмитрия. Саша предлагает и делает код/PR; production mutation
остаётся отдельным gate.
