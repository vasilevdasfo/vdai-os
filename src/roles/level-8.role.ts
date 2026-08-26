import { defineRole } from 'twenty-sdk/define';
import { OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineRole({
  universalIdentifier: '38b27e5b-cb55-4d11-a78e-2c7ed0cb9008', label: 'VDAI L8 · Steward', description: 'Manage VDAI records and access rules. No secrets, global settings or hard delete.', canBeAssignedToUsers: true,
  canReadAllObjectRecords: false, canUpdateAllObjectRecords: false, canSoftDeleteAllObjectRecords: false, canDestroyAllObjectRecords: false, canUpdateAllSettings: false,
  objectPermissions: Object.values(OBJECT_IDS).map((objectUniversalIdentifier) => ({ objectUniversalIdentifier, canReadObjectRecords: true, canUpdateObjectRecords: true, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false })),
  fieldPermissions: [], permissionFlagUniversalIdentifiers: [],
});
