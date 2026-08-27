import { defineRole } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineRole({
  universalIdentifier: '38b27e5b-cb55-4d11-a78e-2c7ed0cb9007', label: 'VDAI L7 · Reviewer', description: 'Architecture and independent proof review; cannot change grants or memberships.', canBeAssignedToUsers: true,
  canReadAllObjectRecords: false, canUpdateAllObjectRecords: false, canSoftDeleteAllObjectRecords: false, canDestroyAllObjectRecords: false,
  // Fail closed. Project-scoped permissions are enabled only after the server accepts
  // and reads back the dynamic RLS predicates from scripts/configure-project-rls.mjs.
  objectPermissions: [],
  fieldPermissions: [],
  permissionFlagUniversalIdentifiers: [],
});
