import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.task,
  nameSingular: 'vdaiTask', namePlural: 'vdaiTasks', labelSingular: 'VDAI Task', labelPlural: 'VDAI Tasks', icon: 'IconChecklist',
  description: 'One owned outcome with next step and proof requirement.',
  fields: [
    { universalIdentifier: FIELD_IDS.task[5], name: 'externalId', type: FieldType.UUID, label: 'Portable ID' },
    { universalIdentifier: FIELD_IDS.task[0], name: 'projectId', type: FieldType.UUID, label: 'Project portable ID' },
    { universalIdentifier: FIELD_IDS.task[1], name: 'sourceKey', type: FieldType.TEXT, label: 'Source key' },
    { universalIdentifier: FIELD_IDS.task[2], name: 'ownerRef', type: FieldType.TEXT, label: 'Owner reference' },
    { universalIdentifier: FIELD_IDS.task[3], name: 'nextStep', type: FieldType.TEXT, label: 'Next step' },
    { universalIdentifier: FIELD_IDS.task[4], name: 'proofRequirement', type: FieldType.TEXT, label: 'Proof requirement' },
  ],
});
