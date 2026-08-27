# Версии, нумерация и синхронизация VDAI OS

## Четыре независимых слоя

| Слой | Канон | Как сравниваем |
|---|---|---|
| Код приложения | Git commit + `package.json` SemVer | `pnpm version:report` до и после apply |
| Схема CRM | universal UUID объектов/полей + apply revision | plan/apply/readback; UUID не переиспользуются |
| Данные | `externalId` записи + `updatedAt` | export/verify и точечный API readback |
| История | `vdaiTaskEvents` + `sourceRef` | append-only события с actor/time/source |

Номер задачи, позиция в меню, уровень L1–L8 и версия приложения — разные вещи.
Их нельзя превращать друг в друга. Семантическая версия относится только к
релизу кода; `externalId` остаётся стабильным при переносе записи.

## Что получает Саша

GitHub не является живой базой и не доставляет Саше новые задачи. После
безопасного shared deployment Саша открывает тот же HTTPS workspace, а сервер
показывает ему разрешённые проекты и записи. GitHub нужен разработчикам для
версий кода, review и apply; рабочие комментарии остаются в CRM.

До shared HTTPS, named invite и отрицательных L7 permission tests Саша не имеет
доказанного удалённого доступа. Локальный `localhost` виден только владельцу
того компьютера, на котором запущен контейнер.

## Откуда появляются новые данные

- Ввод в CRM: запись сразу сохраняется в центральной базе и получает системные
  `createdAt/updatedAt`; значимые изменения отражаются в `vdaiTaskEvents`.
- Telegram intake: сообщение преобразуется в Interaction и связанное событие с
  `sourceRef=tg://chat/.../message/...`; повтор не создаёт дубль.
- Portable import: сравнивает стабильный identity, одинаковое пропускает,
  конфликт останавливает; после apply выполняется `--verify`.
- Git apply: меняет приложение/схему, но не является каналом пользовательских
  данных и не должен перетирать записи CRM.

## Release sequence

1. Зафиксировать outcome и обновить `Unreleased` в `CHANGELOG.md`.
2. Запустить unit/type/lint и `pnpm version:report`.
3. Сделать schema plan, затем apply в точный target workspace.
4. Выполнить UI/API readback и один denied-permission test.
5. Только после proof поднять SemVer/tag и записать дату релиза.

Rollback кода использует предыдущий Git tag/commit; rollback данных использует
совместимый проверенный backup. Они не должны выполняться одной слепой командой.

