import { defineRole } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineRole({
  universalIdentifier: '38b27e5b-cb55-4d11-a78e-2c7ed0cb9007', label: 'VDAI L7 · Reviewer', description: 'Architecture and independent proof review; cannot change grants or memberships.', canBeAssignedToUsers: true,
  canReadAllObjectRecords: false, canUpdateAllObjectRecords: false, canSoftDeleteAllObjectRecords: false, canDestroyAllObjectRecords: false,
  objectPermissions: [
    ...[OBJECT_IDS.workspace, OBJECT_IDS.project, OBJECT_IDS.task, OBJECT_IDS.automation, OBJECT_IDS.interaction, OBJECT_IDS.taskEvent].map((objectUniversalIdentifier) => ({ objectUniversalIdentifier, canReadObjectRecords: true, canUpdateObjectRecords: false, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false })),
    { objectUniversalIdentifier: OBJECT_IDS.helpRequest, canReadObjectRecords: true, canUpdateObjectRecords: true, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false },
    { objectUniversalIdentifier: OBJECT_IDS.proof, canReadObjectRecords: true, canUpdateObjectRecords: true, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false },
  ],
  fieldPermissions: [
    ...FIELD_IDS.helpRequest.slice(0, 5).map((fieldUniversalIdentifier) => ({ objectUniversalIdentifier: OBJECT_IDS.helpRequest, fieldUniversalIdentifier, canReadFieldValue: true, canUpdateFieldValue: false })),
    ...FIELD_IDS.helpRequest.slice(5, 7).map((fieldUniversalIdentifier) => ({ objectUniversalIdentifier: OBJECT_IDS.helpRequest, fieldUniversalIdentifier, canReadFieldValue: true, canUpdateFieldValue: true })),
  ], permissionFlagUniversalIdentifiers: [],
});
