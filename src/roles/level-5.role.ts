import { defineRole } from 'twenty-sdk/define';
import { OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineRole({
  universalIdentifier: '38b27e5b-cb55-4d11-a78e-2c7ed0cb9005', label: 'VDAI L5 · Sandbox Operator', description: 'Contribute and inspect declared sandbox automations. Execution still needs its own gate.', canBeAssignedToUsers: true,
  canReadAllObjectRecords: false, canUpdateAllObjectRecords: false, canSoftDeleteAllObjectRecords: false, canDestroyAllObjectRecords: false,
  objectPermissions: [OBJECT_IDS.project, OBJECT_IDS.task, OBJECT_IDS.helpRequest, OBJECT_IDS.proof, OBJECT_IDS.automation].map((objectUniversalIdentifier) => ({ objectUniversalIdentifier, canReadObjectRecords: true, canUpdateObjectRecords: objectUniversalIdentifier === OBJECT_IDS.task || objectUniversalIdentifier === OBJECT_IDS.helpRequest, canSoftDeleteObjectRecords: false, canDestroyObjectRecords: false })),
  fieldPermissions: [], permissionFlagUniversalIdentifiers: [],
});
