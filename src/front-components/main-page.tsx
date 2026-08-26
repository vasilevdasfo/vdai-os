import { defineFrontComponent } from 'twenty-sdk/define';

import {
  APP_DISPLAY_NAME,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

const levels = [
  ['L1', 'Обучение и открытая демонстрация'],
  ['L2', 'Наблюдение и комментарии'],
  ['L3', 'Запрос помощи и критики'],
  ['L4', 'Работа с назначенными задачами'],
  ['L5', 'Тестовые автоматизации'],
  ['L6', 'Управление процессом проекта'],
  ['L7', 'Архитектура и независимый review'],
  ['L8', 'Управление пространством и правилами'],
] as const;

const surfaces = [
  ['Projects', 'Контекст, owner, ceiling и приватность'],
  ['Tasks', 'Следующий шаг, срок и требование proof'],
  ['Help', 'Комментарий, критика, вклад или proposal'],
  ['Proof', 'Артефакт, независимая проверка и verdict'],
] as const;

const cardStyle = {
  border: '1px solid #dedbd4',
  borderRadius: '12px',
  background: '#fff',
  padding: '16px',
} as const;

const MainPage = () => (
  <main style={{ minHeight: '100%', padding: '28px', color: '#171715', background: '#f4f1eb', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
    <header style={{ maxWidth: '1120px', margin: '0 auto 24px' }}>
      <p style={{ margin: 0, color: '#716d64', fontSize: '12px', letterSpacing: '0.08em' }}>VDAI CLUB · OPERATING LAYER</p>
      <h1 style={{ margin: '8px 0', fontSize: '34px' }}>{APP_DISPLAY_NAME}</h1>
      <p style={{ maxWidth: '760px', margin: 0, color: '#5d5951', lineHeight: 1.55 }}>
        Проекты, задачи, запросы помощи и доказательства результата поверх заменяемого CRM-ядра Twenty.
        Уровень клуба не открывает данные автоматически: действует минимальный из уровня участника и допуска проекта.
      </p>
    </header>
    <section style={{ maxWidth: '1120px', margin: '0 auto 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
      {surfaces.map(([title, text]) => (
        <article key={title} style={cardStyle}>
          <strong>{title}</strong>
          <p style={{ margin: '8px 0 0', color: '#6a665e', lineHeight: 1.45 }}>{text}</p>
        </article>
      ))}
    </section>
    <section style={{ ...cardStyle, maxWidth: '1086px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: '20px' }}>Как запустить проект</h2>
      <p style={{ margin: '0 0 18px', color: '#5d5951', lineHeight: 1.55 }}>
        Project → Task с owner → Help Request для критики → независимый Proof → решение scale / fix / stop.
        Участник получает доступ только через Members & Levels и отдельный Project Access.
      </p>
      <h2 style={{ margin: '0 0 12px', fontSize: '20px' }}>Лестница доступа</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '8px' }}>
        {levels.map(([level, text]) => (
          <div key={level} style={{ display: 'flex', gap: '10px', padding: '10px', borderTop: '1px solid #ece9e3' }}>
            <strong style={{ minWidth: '30px' }}>{level}</strong><span style={{ color: '#5d5951' }}>{text}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '16px 0 0', color: '#8b2e2e', fontSize: '13px' }}>
        Секреты, платежи, production, клиентские данные и внешние отправки требуют отдельного именованного разрешения.
      </p>
    </section>
  </main>
);

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'vdai-os-home',
  description: 'VDAI OS architecture, access ladder and operating surfaces',
  component: MainPage,
});
