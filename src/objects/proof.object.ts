import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.proof,
  nameSingular: 'vdaiProof', namePlural: 'vdaiProofs', labelSingular: 'Проверка', labelPlural: 'Проверка', icon: 'IconRosetteDiscountCheck',
  description: 'Артефакт и независимая оценка. Одна ссылка без review не считается доказательством.',
  fields: [
    { universalIdentifier: FIELD_IDS.proof[0], name: 'taskId', type: FieldType.UUID, label: 'ID задачи' },
    { universalIdentifier: FIELD_IDS.proof[1], name: 'artifactRef', type: FieldType.TEXT, label: 'Артефакт' },
    { universalIdentifier: FIELD_IDS.proof[2], name: 'verifierRef', type: FieldType.TEXT, label: 'Проверяющий' },
    { universalIdentifier: FIELD_IDS.proof[3], name: 'verdict', type: FieldType.SELECT, label: 'Решение', defaultValue: "'PENDING'", options: [
      { value: 'PENDING', label: 'Ожидает проверки', position: 0, color: 'gray' }, { value: 'ACCEPTED', label: 'Принято', position: 1, color: 'green' }, { value: 'REJECTED', label: 'Возвращено', position: 2, color: 'red' },
    ] },
  ],
});
