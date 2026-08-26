import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.taskEvent,
  nameSingular: 'vdaiTaskEvent', namePlural: 'vdaiTaskEvents', labelSingular: 'Событие задачи', labelPlural: 'История задач', icon: 'IconHistory',
  description: 'Хронология создания и развития задачи с автором и источником изменения.',
  fields: [
    { universalIdentifier: FIELD_IDS.taskEvent[0], name: 'taskId', type: FieldType.UUID, label: 'ID задачи' },
    { universalIdentifier: FIELD_IDS.taskEvent[1], name: 'eventType', type: FieldType.SELECT, label: 'Тип события', defaultValue: "'CREATED'", options: [
      { value: 'CREATED', label: 'Создана', position: 0, color: 'blue' }, { value: 'UPDATED', label: 'Изменена', position: 1, color: 'yellow' }, { value: 'ASSIGNED', label: 'Назначена', position: 2, color: 'purple' }, { value: 'STATUS', label: 'Смена статуса', position: 3, color: 'orange' }, { value: 'PROOF', label: 'Добавлена проверка', position: 4, color: 'green' }, { value: 'COMMENT', label: 'Комментарий', position: 5, color: 'gray' },
    ] },
    { universalIdentifier: FIELD_IDS.taskEvent[2], name: 'actorRef', type: FieldType.TEXT, label: 'Кто изменил' },
    { universalIdentifier: FIELD_IDS.taskEvent[3], name: 'summary', type: FieldType.TEXT, label: 'Что изменилось' },
    { universalIdentifier: FIELD_IDS.taskEvent[4], name: 'sourceRef', type: FieldType.TEXT, label: 'Источник' },
  ],
});
