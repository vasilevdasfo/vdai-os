import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync('src/front-components/main-page.tsx', 'utf8');

describe('VDAI OS home learning page', () => {
  it('explains the workflow, rules and selected Bitrix kernel', () => {
    for (const text of ['Старт: как работать', 'Пять правил', 'Что берём из Bitrix', 'На проверке', 'API и Telegram']) expect(page).toContain(text);
  });

  it('shows the club ecosystem without enabling financial operations', () => {
    for (const text of ['Нараяна Центр', 'Курсы ИИ · vdai.me', 'Оплата картами', 'Обменник']) expect(page).toContain(text);
    expect(page).toContain('реальные операции требуют отдельного доступа');
    expect(page).toContain('без ключей, денег и операций');
  });

  it('shows truthful version and synchronization status', () => {
    for (const text of ['Версия приложения', 'Telegram checkpoint', 'Доступ Саши', 'GitHub не синхронизирует задачи']) expect(page).toContain(text);
  });
});
