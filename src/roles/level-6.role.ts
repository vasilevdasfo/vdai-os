import { defineRole } from 'twenty-sdk/define';
import { OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineRole({
  universalIdentifier: '38b27e5b-cb55-4d11-a78e-2c7ed0cb9006', label: 'VDAI L6 · Project Operator', description: 'Manage project workflow without access to membership, grants, secrets or destructive actions.', canBeAssignedToUsers: true,
  canReadAllObjectRecords: false, canUpdateAllObjectRecords: false, canSoftDeleteAllObjectRecords: false, canDestroyAllObjectRecords: false,
  objectPermissions: [
    ...[OBJECT_IDS.project, OBJECT_IDS.task, OBJECT_IDS.helpRequest, OBJECT_IDS.automation].map((objectUniversalIdentifier) => ({ objectUniversalIdentifier, canReadObjectRecords: true, canUpdateObjectRecords: true, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false })),
    { objectUniversalIdentifier: OBJECT_IDS.proof, canReadObjectRecords: true, canUpdateObjectRecords: false, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false },
  ],
  fieldPermissions: [], permissionFlagUniversalIdentifiers: [],
});
