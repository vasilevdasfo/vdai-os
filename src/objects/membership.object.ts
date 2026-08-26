import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.membership,
  nameSingular: 'vdaiMembership', namePlural: 'vdaiMemberships', labelSingular: 'VDAI Membership', labelPlural: 'VDAI Memberships', icon: 'IconUserShield',
  description: 'Evidence-backed club level. It never grants project access by itself.',
  fields: [
    { universalIdentifier: FIELD_IDS.membership[0], name: 'memberRef', type: FieldType.TEXT, label: 'Member reference' },
    { universalIdentifier: FIELD_IDS.membership[1], name: 'clubLevel', type: FieldType.NUMBER, label: 'Club level', isNullable: false, defaultValue: 1 },
    { universalIdentifier: FIELD_IDS.membership[2], name: 'evidenceRef', type: FieldType.TEXT, label: 'Evidence reference' },
    { universalIdentifier: FIELD_IDS.membership[3], name: 'expiresAt', type: FieldType.DATE_TIME, label: 'Expires at' },
  ],
});
