export const L7_ROLE_LABEL = 'VDAI L7 · Reviewer';

export const PROJECT_SCOPED_OBJECTS = [
  'vdaiProject',
  'vdaiTask',
  'vdaiAutomation',
  'vdaiInteraction',
  'vdaiTaskEvent',
  'vdaiTaskComment',
  'vdaiHelpRequest',
  'vdaiProof',
];

export function buildProjectRlsInput({ roleId, objectMetadataId, accessSubjectFieldMetadataId, workspaceMemberIdFieldMetadataId }) {
  if (![roleId, objectMetadataId, accessSubjectFieldMetadataId, workspaceMemberIdFieldMetadataId].every(Boolean)) {
    throw new Error('missing_rls_identifier');
  }

  return {
    roleId,
    objectMetadataId,
    predicates: [{
      fieldMetadataId: accessSubjectFieldMetadataId,
      operand: 'IS',
      workspaceMemberFieldMetadataId: workspaceMemberIdFieldMetadataId,
    }],
    predicateGroups: [],
  };
}
