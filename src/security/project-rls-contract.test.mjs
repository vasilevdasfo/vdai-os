import { describe, expect, it } from 'vitest';
import { buildProjectRlsInput, PROJECT_SCOPED_OBJECTS } from '../../scripts/lib/project-rls-contract.mjs';

describe('project RLS contract', () => {
  it('binds every exposed object to the authenticated workspace member', () => {
    expect(PROJECT_SCOPED_OBJECTS).toHaveLength(8);
    const input = buildProjectRlsInput({ roleId: 'role', objectMetadataId: 'object', accessSubjectFieldMetadataId: 'access', workspaceMemberIdFieldMetadataId: 'member-id' });
    expect(input.predicates).toEqual([{ fieldMetadataId: 'access', operand: 'IS', workspaceMemberFieldMetadataId: 'member-id' }]);
    expect(JSON.stringify(input)).not.toContain('value');
  });

  it('fails closed when an identifier is absent', () => {
    expect(() => buildProjectRlsInput({ roleId: 'role' })).toThrow('missing_rls_identifier');
  });
});
