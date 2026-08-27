import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.taskComment,
  nameSingular: 'vdaiTaskComment', namePlural: 'vdaiTaskComments', labelSingular: 'Комментарий к задаче', labelPlural: 'Комментарии к задачам', icon: 'IconMessage',
  description: 'Человеческое обсуждение задачи. Автор задаётся сервером; удаление заменяется аудируемой редакцией.',
  fields: [
    { universalIdentifier: FIELD_IDS.taskComment[0], name: 'externalId', type: FieldType.UUID, label: 'Переносимый ID' },
    { universalIdentifier: FIELD_IDS.taskComment[1], name: 'taskId', type: FieldType.UUID, label: 'ID задачи' },
    { universalIdentifier: FIELD_IDS.taskComment[2], name: 'authorRef', type: FieldType.TEXT, label: 'Автор' },
    { universalIdentifier: FIELD_IDS.taskComment[3], name: 'body', type: FieldType.TEXT, label: 'Комментарий' },
    { universalIdentifier: FIELD_IDS.taskComment[4], name: 'sourceRef', type: FieldType.TEXT, label: 'Источник' },
    { universalIdentifier: FIELD_IDS.taskComment[5], name: 'parentCommentId', type: FieldType.UUID, label: 'Ответ на комментарий' },
  ],
});
