import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.workspace,
  nameSingular: 'vdaiWorkspace', namePlural: 'vdaiWorkspaces', labelSingular: 'VDAI Workspace', labelPlural: 'VDAI Workspaces', icon: 'IconBuilding',
  description: 'Company or club workspace boundary. Contains no credentials.',
  fields: [
    { universalIdentifier: FIELD_IDS.workspace[0], name: 'externalId', type: FieldType.TEXT, label: 'Portable ID', isNullable: false, defaultValue: "'unset'" },
    { universalIdentifier: FIELD_IDS.workspace[1], name: 'privacy', type: FieldType.SELECT, label: 'Privacy', defaultValue: "'PRIVATE'", options: [
      { value: 'PRIVATE', label: 'Private', position: 0, color: 'red' }, { value: 'CLUB', label: 'Club', position: 1, color: 'blue' }, { value: 'PUBLIC', label: 'Public', position: 2, color: 'green' },
    ] },
    { universalIdentifier: FIELD_IDS.workspace[2], name: 'levelCeiling', type: FieldType.NUMBER, label: 'Level ceiling', isNullable: false, defaultValue: 1 },
  ],
});
