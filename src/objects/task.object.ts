import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.task,
  nameSingular: 'vdaiTask', namePlural: 'vdaiTasks', labelSingular: 'Задача', labelPlural: 'Задачи', icon: 'IconChecklist',
  description: 'Задача с ответственным, сроком, следующим шагом и проверкой результата.',
  fields: [
    { universalIdentifier: FIELD_IDS.task[5], name: 'externalId', type: FieldType.UUID, label: 'Переносимый ID' },
    { universalIdentifier: FIELD_IDS.task[0], name: 'projectId', type: FieldType.UUID, label: 'ID проекта' },
    { universalIdentifier: FIELD_IDS.task[1], name: 'sourceKey', type: FieldType.TEXT, label: 'Источник' },
    { universalIdentifier: FIELD_IDS.task[2], name: 'ownerRef', type: FieldType.TEXT, label: 'Ответственный' },
    { universalIdentifier: FIELD_IDS.task[3], name: 'nextStep', type: FieldType.TEXT, label: 'Следующий шаг' },
    { universalIdentifier: FIELD_IDS.task[4], name: 'proofRequirement', type: FieldType.TEXT, label: 'Критерий проверки' },
    { universalIdentifier: FIELD_IDS.task[6], name: 'status', type: FieldType.SELECT, label: 'Статус', defaultValue: "'INTAKE'", options: [
      { value: 'INTAKE', label: 'Входящая', position: 0, color: 'gray' }, { value: 'READY', label: 'Готова к работе', position: 1, color: 'blue' }, { value: 'ACTIVE', label: 'В работе', position: 2, color: 'yellow' }, { value: 'VERIFY', label: 'На проверке', position: 3, color: 'purple' }, { value: 'DONE', label: 'Готово', position: 4, color: 'green' }, { value: 'BLOCKED', label: 'Заблокирована', position: 5, color: 'red' }, { value: 'HOLD', label: 'Отложена', position: 6, color: 'orange' },
    ] },
    { universalIdentifier: FIELD_IDS.task[7], name: 'dueAt', type: FieldType.DATE_TIME, label: 'Срок' },
    { universalIdentifier: FIELD_IDS.task[8], name: 'pilotMetric', type: FieldType.TEXT, label: 'Метрика результата' },
    { universalIdentifier: FIELD_IDS.task[9], name: 'accessSubjectId', type: FieldType.UUID, label: 'Участник доступа' },
  ],
});
