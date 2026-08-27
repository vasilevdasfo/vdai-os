# Центральная синхронизация Дмитрий ↔ Саша ↔ Telegram

Один MAIN и одна центральная CRM являются owner живых проектов, задач,
комментариев, proof и audit events. GitHub является owner кода и схемы, но не
пользовательских данных.

## Потоки

- Дмитрий/Саша → HTTPS CRM → server-side access check → запись → audit event.
- Telegram → checkpoint delta → allowlist/redaction → Interaction/Comment/Event
  с точным `sourceRef` → idempotent apply → checkpoint только после readback.
- GitHub → reviewed commit/tag → schema plan → apply → UI/API readback. Apply не
  перезаписывает пользовательские записи.

## Conflict and ordering

- `externalId` идентифицирует переносимую запись; позиция строки не является ID.
- `sourceRef` идентифицирует Telegram/import событие и предотвращает дубль.
- `updatedAt` используется для обнаружения изменения, но не заменяет audit event.
- Одинаковый identity + одинаковое содержание = skip; одинаковый identity +
  другое неизменяемое содержание = conflict и ручное решение, не last-write-wins.

## Access gate

Саша получает данные не из GitHub, а из той же центральной CRM после named
invite и effective access `workspace role ∩ membership ∩ active project grant`.
До HTTPS, L7 negative tests и revoke proof статус остаётся `NOT_ISSUED`.

## Readback

Главная страница показывает app/schema/data contract, режим синхронизации,
Telegram checkpoint и статус доступа Саши. Git commit читается командой
`pnpm version:report`; runtime last-sync станет серверным полем после появления
центрального sync adapter и не должен подделываться статической датой.

