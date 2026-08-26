import { defineRole } from 'twenty-sdk/define';
import { OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineRole({
  universalIdentifier: '38b27e5b-cb55-4d11-a78e-2c7ed0cb9002', label: 'VDAI L2 · Observer', description: 'Read approved project and task records.', canBeAssignedToUsers: true,
  canReadAllObjectRecords: false, canUpdateAllObjectRecords: false, canSoftDeleteAllObjectRecords: false, canDestroyAllObjectRecords: false,
  objectPermissions: [OBJECT_IDS.project, OBJECT_IDS.task, OBJECT_IDS.proof].map((objectUniversalIdentifier) => ({ objectUniversalIdentifier, canReadObjectRecords: true, canUpdateObjectRecords: false, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false })),
  fieldPermissions: [], permissionFlagUniversalIdentifiers: [],
});
