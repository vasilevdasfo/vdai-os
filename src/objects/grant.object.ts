import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.grant,
  nameSingular: 'vdaiGrant', namePlural: 'vdaiGrants', labelSingular: 'VDAI Project Grant', labelPlural: 'VDAI Project Grants', icon: 'IconKey',
  description: 'Named, scoped and expiring access to one project.',
  fields: [
    { universalIdentifier: FIELD_IDS.grant[0], name: 'projectId', type: FieldType.UUID, label: 'Project portable ID' },
    { universalIdentifier: FIELD_IDS.grant[1], name: 'memberRef', type: FieldType.TEXT, label: 'Member reference' },
    { universalIdentifier: FIELD_IDS.grant[2], name: 'projectRole', type: FieldType.SELECT, label: 'Project role', defaultValue: "'OBSERVER'", options: [
      { value: 'OBSERVER', label: 'Observer', position: 0, color: 'gray' }, { value: 'COMMENTER', label: 'Commenter', position: 1, color: 'blue' }, { value: 'CONTRIBUTOR', label: 'Contributor', position: 2, color: 'green' }, { value: 'EDITOR', label: 'Editor', position: 3, color: 'yellow' }, { value: 'OWNER', label: 'Owner', position: 4, color: 'red' }, { value: 'REVIEWER', label: 'Reviewer', position: 5, color: 'purple' }, { value: 'STEWARD', label: 'Steward', position: 6, color: 'orange' },
    ] },
    { universalIdentifier: FIELD_IDS.grant[3], name: 'expiresAt', type: FieldType.DATE_TIME, label: 'Expires at' },
  ],
});
