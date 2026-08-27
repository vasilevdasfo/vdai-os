import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.automation,
  nameSingular: 'vdaiAutomation', namePlural: 'vdaiAutomations', labelSingular: 'VDAI Automation', labelPlural: 'VDAI Automations', icon: 'IconRobot',
  description: 'Bounded automation with owner, tier and declared permissions.',
  fields: [
    { universalIdentifier: FIELD_IDS.automation[0], name: 'projectId', type: FieldType.UUID, label: 'Project portable ID' },
    { universalIdentifier: FIELD_IDS.automation[1], name: 'ownerRef', type: FieldType.TEXT, label: 'Owner reference' },
    { universalIdentifier: FIELD_IDS.automation[2], name: 'tier', type: FieldType.SELECT, label: 'Automation tier', defaultValue: "'A0_DEMO'", options: [
      { value: 'A0_DEMO', label: 'A0 Demo', position: 0, color: 'gray' }, { value: 'A1_READ', label: 'A1 Read-only', position: 1, color: 'blue' }, { value: 'A2_DRAFT', label: 'A2 Draft', position: 2, color: 'green' }, { value: 'A3_GATED', label: 'A3 Gated action', position: 3, color: 'yellow' }, { value: 'A4_BOUNDED', label: 'A4 Bounded autopilot', position: 4, color: 'red' },
    ] },
    { universalIdentifier: FIELD_IDS.automation[3], name: 'permissions', type: FieldType.ARRAY, label: 'Declared permissions' },
    { universalIdentifier: FIELD_IDS.automation[4], name: 'accessSubjectId', type: FieldType.UUID, label: 'Access subject' },
  ],
});
