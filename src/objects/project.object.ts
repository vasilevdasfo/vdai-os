import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.project,
  nameSingular: 'vdaiProject', namePlural: 'vdaiProjects', labelSingular: 'VDAI Project', labelPlural: 'VDAI Projects', icon: 'IconBriefcase',
  description: 'Named project with an owner and explicit access ceiling.',
  fields: [
    { universalIdentifier: FIELD_IDS.project[4], name: 'externalId', type: FieldType.UUID, label: 'Portable ID' },
    { universalIdentifier: FIELD_IDS.project[0], name: 'workspaceId', type: FieldType.UUID, label: 'Workspace portable ID' },
    { universalIdentifier: FIELD_IDS.project[1], name: 'sourceKey', type: FieldType.TEXT, label: 'Source key' },
    { universalIdentifier: FIELD_IDS.project[2], name: 'ownerRef', type: FieldType.TEXT, label: 'Owner reference' },
    { universalIdentifier: FIELD_IDS.project[3], name: 'levelCeiling', type: FieldType.NUMBER, label: 'Level ceiling', isNullable: false, defaultValue: 1 },
  ],
});
