import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.interaction,
  nameSingular: 'vdaiInteraction', namePlural: 'vdaiInteractions', labelSingular: 'Переписка', labelPlural: 'Переписки', icon: 'IconMessages',
  description: 'Рабочая выжимка из переписки: решение, следующий шаг и ссылка на источник.',
  fields: [
    { universalIdentifier: FIELD_IDS.interaction[0], name: 'contactRef', type: FieldType.TEXT, label: 'Собеседник' },
    { universalIdentifier: FIELD_IDS.interaction[1], name: 'channel', type: FieldType.SELECT, label: 'Канал', defaultValue: "'TELEGRAM'", options: [
      { value: 'TELEGRAM', label: 'Telegram', position: 0, color: 'blue' }, { value: 'EMAIL', label: 'Почта', position: 1, color: 'yellow' }, { value: 'CALL', label: 'Созвон', position: 2, color: 'green' }, { value: 'OTHER', label: 'Другое', position: 3, color: 'gray' },
    ] },
    { universalIdentifier: FIELD_IDS.interaction[2], name: 'sourceRef', type: FieldType.TEXT, label: 'Ссылка на источник' },
    { universalIdentifier: FIELD_IDS.interaction[3], name: 'summary', type: FieldType.TEXT, label: 'Краткое содержание' },
    { universalIdentifier: FIELD_IDS.interaction[4], name: 'decision', type: FieldType.TEXT, label: 'Решение' },
    { universalIdentifier: FIELD_IDS.interaction[5], name: 'nextAction', type: FieldType.TEXT, label: 'Следующее действие' },
  ],
});
