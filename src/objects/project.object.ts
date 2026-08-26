import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.project,
  nameSingular: 'vdaiProject', namePlural: 'vdaiProjects', labelSingular: 'Проект', labelPlural: 'Проекты', icon: 'IconBriefcase',
  description: 'Проект с ответственным, стадией продукта и ограничением доступа.',
  fields: [
    { universalIdentifier: FIELD_IDS.project[4], name: 'externalId', type: FieldType.UUID, label: 'Переносимый ID' },
    { universalIdentifier: FIELD_IDS.project[0], name: 'workspaceId', type: FieldType.UUID, label: 'ID пространства' },
    { universalIdentifier: FIELD_IDS.project[1], name: 'sourceKey', type: FieldType.TEXT, label: 'Источник' },
    { universalIdentifier: FIELD_IDS.project[2], name: 'ownerRef', type: FieldType.TEXT, label: 'Ответственный' },
    { universalIdentifier: FIELD_IDS.project[3], name: 'levelCeiling', type: FieldType.NUMBER, label: 'Максимальный уровень', isNullable: false, defaultValue: 1 },
    { universalIdentifier: FIELD_IDS.project[5], name: 'productStage', type: FieldType.SELECT, label: 'Стадия продукта', defaultValue: "'PROBLEM'", options: [
      { value: 'PROBLEM', label: 'Проблема', position: 0, color: 'gray' }, { value: 'PILOT', label: 'Пилот', position: 1, color: 'blue' }, { value: 'PROOF', label: 'Доказательство', position: 2, color: 'yellow' }, { value: 'CASE', label: 'Кейс', position: 3, color: 'green' }, { value: 'SCALE', label: 'Масштабирование', position: 4, color: 'purple' },
    ] },
    { universalIdentifier: FIELD_IDS.project[6], name: 'pilotMetric', type: FieldType.TEXT, label: 'Метрика пилота' },
  ],
});
