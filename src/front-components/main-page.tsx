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
  ['Экосистема клуба', 'Участники, их проекты, сайты, продукты и полезные связи — вместо чужого списка Companies'],
  ['Проекты', 'Контекст, ответственный, стадия продукта и уровень доступа'],
  ['Задачи', 'Статус, следующий шаг, срок и метрика результата'],
  ['Запросы помощи', 'Наблюдение, комментарий, критика или совместная работа'],
  ['Проверка', 'Артефакт, независимая оценка и подтверждённый результат'],
  ['Переписки', 'Краткая выжимка, решение, следующий шаг и ссылка на исходный чат'],
  ['История задач', 'Кто, когда и почему создал или изменил задачу'],
] as const;

const startSteps = [
  ['Выберите проект', 'Работа начинается не с общего чата, а с одного проекта и понятного результата.'],
  ['Создайте задачу', 'Укажите ответственного, следующий шаг, срок, метрику и критерий «готово».'],
  ['Обсуждайте внутри задачи', 'Пожелания, вопросы и решения остаются рядом с задачей; Telegram хранится как источник.'],
  ['Приложите proof', 'Ссылка, файл, тест или измерение подтверждают выполнение — одного статуса недостаточно.'],
  ['Отправьте на проверку', 'Reviewer принимает результат или возвращает его с конкретной причиной.'],
] as const;

const operatingRules = [
  'Один owner, один outcome и один следующий проверяемый шаг.',
  'Не переносим весь чат: сохраняем решение, контекст и ссылку на первоисточник.',
  'Уровень клуба не даёт автоматический доступ к проекту или данным.',
  'Платежи, обмен, production, секреты и клиентские данные — только по отдельному разрешению.',
  'Localhost и статус «готово» не равны доставленному и принятому результату.',
] as const;

const bitrixKernel = [
  ['Карточка задачи', 'Описание, owner, срок, чек-лист, комментарии и вложения.'],
  ['Лента работы', 'Комментарии людей отдельно от неизменяемой истории действий.'],
  ['Проверка результата', 'В работе → На проверке → Принято или Возврат с причиной.'],
  ['Канбан', 'Понятные стадии проекта без десятков лишних воронок.'],
  ['Автоматизация', 'Уведомления и действия по событию только с owner и stop-rule.'],
  ['API и Telegram', 'Событие содержит ID; система забирает актуальную карточку и не дублирует запись.'],
] as const;

const clubEcosystem = [
  ['Нараяна Центр', 'Центр и площадка сообщества', 'Сайт и рабочие проекты центра'],
  ['Курсы ИИ · vdai.me', 'Обучение', 'Программы, материалы, участники и результаты обучения'],
  ['Оплата картами', 'Платёжное направление', 'Только каталог и задачи; реальные операции требуют отдельного доступа'],
  ['Обменник', 'Финансовое направление', 'Только проектный контур; без ключей, денег и операций внутри общей CRM'],
] as const;

const reviewerFlow = [
  ['Пожелание', 'Сохраняем короткую выжимку из созвона или Telegram со ссылкой на первоисточник.'],
  ['Задача', 'Фиксируем owner, следующий шаг, срок, метрику и критерий готовности.'],
  ['Запрос помощи', 'Указываем, что именно нужно от L7: архитектурная критика, проверка или предложение улучшения.'],
  ['Ответ L7', 'Reviewer комментирует задачу, но не меняет memberships, grants и чужой результат.'],
  ['Proof', 'L7 принимает или отклоняет артефакт с причиной; ссылка без review не считается результатом.'],
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
        Рабочее пространство клуба: кто с нами, над чем работаем, что делать следующим шагом и чем доказан результат.
        Начните с инструкции ниже; CRM-ядро Twenty остаётся технической основой, а не моделью нашей экосистемы.
      </p>
    </header>
    <section style={{ ...cardStyle, maxWidth: '1086px', margin: '0 auto 20px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '22px' }}>Старт: как работать в VDAI OS</h2>
      <p style={{ margin: '0 0 16px', color: '#5d5951', lineHeight: 1.55 }}>
        Это не база ради базы. Каждый проект проходит короткий цикл от задачи до проверенного результата.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '8px' }}>
        {startSteps.map(([title, text], index) => (
          <div key={title} style={{ padding: '12px', borderTop: '3px solid #171715', background: '#faf8f4' }}>
            <span style={{ color: '#8b2e2e', fontSize: '12px' }}>ШАГ {index + 1}</span>
            <strong style={{ display: 'block', margin: '4px 0 6px' }}>{title}</strong>
            <span style={{ color: '#5d5951', fontSize: '13px', lineHeight: 1.45 }}>{text}</span>
          </div>
        ))}
      </div>
      <h3 style={{ margin: '20px 0 8px' }}>Пять правил</h3>
      <ul style={{ margin: 0, paddingLeft: '20px', color: '#5d5951', lineHeight: 1.65 }}>
        {operatingRules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </section>
    <section style={{ maxWidth: '1120px', margin: '0 auto 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
      {surfaces.map(([title, text]) => (
        <article key={title} style={cardStyle}>
          <strong>{title}</strong>
          <p style={{ margin: '8px 0 0', color: '#6a665e', lineHeight: 1.45 }}>{text}</p>
        </article>
      ))}
    </section>
    <section style={{ ...cardStyle, maxWidth: '1086px', margin: '0 auto 20px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Что берём из Bitrix — без его перегруза</h2>
      <p style={{ margin: '0 0 14px', color: '#5d5951' }}>Только функции, которые помогают довести работу до результата.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))', gap: '8px' }}>
        {bitrixKernel.map(([title, text]) => (
          <div key={title} style={{ padding: '12px', background: '#faf8f4', borderLeft: '3px solid #8b2e2e' }}>
            <strong>{title}</strong><p style={{ margin: '6px 0 0', color: '#5d5951', lineHeight: 1.45 }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={{ ...cardStyle, maxWidth: '1086px', margin: '0 auto 20px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Экосистема клуба</h2>
      <p style={{ margin: '0 0 14px', color: '#5d5951', lineHeight: 1.5 }}>
        Раздел Companies из демо Twenty не является нашим справочником. Здесь показываем людей клуба, их сайты, продукты и направления.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '10px' }}>
        {clubEcosystem.map(([name, kind, text]) => (
          <article key={name} style={{ padding: '14px', border: '1px solid #e4e0d9', borderRadius: '10px' }}>
            <span style={{ color: '#8b2e2e', fontSize: '12px' }}>{kind}</span>
            <h3 style={{ margin: '5px 0 7px', fontSize: '17px' }}>{name}</h3>
            <p style={{ margin: 0, color: '#5d5951', lineHeight: 1.45 }}>{text}</p>
          </article>
        ))}
      </div>
    </section>
    <section style={{ ...cardStyle, maxWidth: '1086px', margin: '0 auto 20px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: '20px' }}>Как синхронизироваться с L7 Reviewer</h2>
      <p style={{ margin: '0 0 16px', color: '#5d5951', lineHeight: 1.55 }}>
        Не копируем весь чат. Передаём только решение, задачу, точный запрос помощи и критерий независимой проверки.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '8px' }}>
        {reviewerFlow.map(([title, text], index) => (
          <div key={title} style={{ padding: '12px', borderTop: '2px solid #171715', background: '#faf8f4' }}>
            <span style={{ color: '#8b2e2e', fontSize: '12px' }}>0{index + 1}</span>
            <strong style={{ display: 'block', margin: '4px 0 6px' }}>{title}</strong>
            <span style={{ color: '#5d5951', fontSize: '13px', lineHeight: 1.45 }}>{text}</span>
          </div>
        ))}
      </div>
    </section>
    <section style={{ ...cardStyle, maxWidth: '1086px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: '20px' }}>Как запустить проект</h2>
      <p style={{ margin: '0 0 18px', color: '#5d5951', lineHeight: 1.55 }}>
        Проект → задача с ответственным → запрос помощи для критики → независимая проверка → решение: масштабировать, исправить или остановить.
        Участник получает доступ только через свой уровень клуба и отдельный допуск к проекту.
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
