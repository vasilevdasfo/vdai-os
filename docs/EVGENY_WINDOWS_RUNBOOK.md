# Евгений Бычковский: Windows-пилот VDAI OS

Этот маршрут относится к существующему VDAI OS MAIN. Он не создаёт второй
dashboard, Telegram-бот, реестр или отдельную операционную систему.

## Рабочий режим экономии

- По умолчанию: один агент, один точный outcome, один проход, low reasoning.
- Обычная задача: максимум 8 model/tool шагов и 2 повтора операции.
- Checkpoint: 40 шагов, cumulative input >2M или два последовательных вызова
  >100k. Сохранить proof и продолжить новой адресной задачей с capsule.
- Stop: 100 шагов, cumulative input >10M или повторная compaction без результата.
- Capsule вместо полного чата: outcome, source of truth, gates, решение, proof,
  незавершённое, следующий проверяемый шаг и `codex://`-источник.
- Кэш не отключать. Экономия достигается меньшим повторным контекстом и
  отсутствием скрытого fan-out.
- Research, несколько агентов, SOS2 и дорогая модель — только по прямой команде
  Дмитрия или доказанной сложности. Каждому агенту — узкий bounded subtask.
- Telegram-бот, dashboard, утренний briefing и другие фоны работают только с
  owner, measurable outcome, budget, stop-rule и независимым proof. Нет нового
  полезного результата — automation ставится на паузу.

## A. Подготовка и локальная тестовая установка

Поддерживаемая архитектура пилота: Windows 11 x64, WSL2 virtualization, Docker
Desktop Linux containers, Git, Node.js 24.x и pnpm 11.19.0. Windows ARM64 и
Windows Server не объявляются поддержанными без отдельного clean-run proof.

Женя выполняет команды только после точного OK Дмитрия и получения проверенного
архива `vdai-os-windows-pilot.zip` с SHA-256 по отдельному каналу:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\windows-preflight.ps1
.\scripts\windows-bootstrap.ps1
.\scripts\windows-bootstrap.ps1 -Start
docker compose ps
Invoke-WebRequest http://localhost:3000/healthz -UseBasicParsing
```

`windows-bootstrap.ps1` генерирует локальные секреты на устройстве, не печатает
их и не заменяет существующий `.env`. Без `-Start` он только валидирует Compose.
Скачивание пакетов через `-Install` выполняется только самим Женей с правами
администратора и после просмотра списка Git/Docker Desktop/Node.js.

После первого запуска: открыть `http://localhost:3000`, создать только локальный
тестовый workspace без реальных клиентских данных, затем установить VDAI app по
`SETUP.md`. Localhost доказывает только локальный тест, не delivery/production.

## B. Ручной gate Жени

До gate запрещены отправка архива, invite, логин и любые изменения устройства.
Женя самостоятельно подтверждает устройство/Windows edition/architecture,
Docker Desktop, список устанавливаемых пакетов и запуск команд. Пароли, API
tokens, 2FA, Telegram session и личные секреты не запрашиваются и не передаются.

## C. Независимый readback

Установка считается доказанной только когда зафиксированы:

- идентифицированное Windows-устройство Жени;
- healthy Compose services и открытие VDAI OS именно на нём;
- вход в отдельный тестовый ограниченный workspace;
- успешный повторный запуск после `docker compose down`;
- отказ для secrets, payments, production, client data и управления доступом;
- проверенный rollback.

## Rollback и удаление

Без удаления данных: `docker compose down`. Повторный запуск: `docker compose up
-d`. Полное удаление volumes разрушительно и выполняется только после отдельного
OK, проверенного экспорта и команды `docker compose down --volumes`. Сам архив
можно удалить обычной корзиной Windows; `.env` нельзя отправлять или архивировать.

VDAI OS не получает автоматически файлы Windows, пароли, browser profile,
Telegram, почту, 2FA, платёжные данные, production, client data или Docker socket.
Любая будущая интеграция требует отдельного scope и OK.

