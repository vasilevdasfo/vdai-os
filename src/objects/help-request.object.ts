import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.helpRequest,
  nameSingular: 'vdaiHelpRequest', namePlural: 'vdaiHelpRequests', labelSingular: 'Запрос помощи', labelPlural: 'Запросы помощи', icon: 'IconMessageQuestion',
  description: 'Точный запрос наблюдения, критики, вклада или редактирования.',
  fields: [
    { universalIdentifier: FIELD_IDS.helpRequest[0], name: 'taskId', type: FieldType.UUID, label: 'ID задачи' },
    { universalIdentifier: FIELD_IDS.helpRequest[1], name: 'requestedByRef', type: FieldType.TEXT, label: 'Кто запросил' },
    { universalIdentifier: FIELD_IDS.helpRequest[2], name: 'participantRef', type: FieldType.TEXT, label: 'Кому адресовано' },
    { universalIdentifier: FIELD_IDS.helpRequest[3], name: 'helpRole', type: FieldType.SELECT, label: 'Роль помощи', defaultValue: "'COMMENTER'", options: [
      { value: 'OBSERVER', label: 'Наблюдение', position: 0, color: 'gray' }, { value: 'COMMENTER', label: 'Критика', position: 1, color: 'blue' }, { value: 'CONTRIBUTOR', label: 'Совместная работа', position: 2, color: 'green' }, { value: 'EDITOR', label: 'Редактирование', position: 3, color: 'yellow' },
    ] },
    { universalIdentifier: FIELD_IDS.helpRequest[4], name: 'request', type: FieldType.TEXT, label: 'Что именно нужно' },
    { universalIdentifier: FIELD_IDS.helpRequest[5], name: 'response', type: FieldType.TEXT, label: 'Ответ участника' },
    { universalIdentifier: FIELD_IDS.helpRequest[6], name: 'status', type: FieldType.SELECT, label: 'Статус ответа', defaultValue: "'PENDING'", options: [
      { value: 'PENDING', label: 'Ожидает ответа', position: 0, color: 'gray' }, { value: 'ANSWERED', label: 'Ответ получен', position: 1, color: 'blue' }, { value: 'ACCEPTED', label: 'Принято', position: 2, color: 'green' },
    ] },
    { universalIdentifier: FIELD_IDS.helpRequest[7], name: 'accessSubjectId', type: FieldType.UUID, label: 'Участник доступа' },
  ],
});
