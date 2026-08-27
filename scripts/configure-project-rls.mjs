import { buildProjectRlsInput, L7_ROLE_LABEL, PROJECT_SCOPED_OBJECTS } from './lib/project-rls-contract.mjs';

const baseUrl = (process.env.TWENTY_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const apiKey = process.env.TWENTY_API_KEY;
const apply = process.argv.includes('--apply');

if (!apiKey) throw new Error('TWENTY_API_KEY is required');

async function metadata(query, variables) {
  const response = await fetch(`${baseUrl}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.map((error) => error.message).join('; ') || `HTTP ${response.status}`);
  }
  return payload.data;
}

async function main() {
  const objects = await metadata(`{ objects(paging:{first:200}) { edges { node { id nameSingular fields(paging:{first:200}) { edges { node { id name } } } } } } getRoles { id label } }`);
  const byName = new Map(objects.objects.edges.map(({ node }) => [node.nameSingular, node]));
  const role = objects.getRoles.find((candidate) => candidate.label === L7_ROLE_LABEL);
  const member = byName.get('workspaceMember');
  const memberIdField = member?.fields.edges.find(({ node }) => node.name === 'id')?.node;
  if (!role || !memberIdField) throw new Error('role_or_workspace_member_id_field_not_found');

  const inputs = PROJECT_SCOPED_OBJECTS.map((name) => {
    const object = byName.get(name);
    const accessField = object?.fields.edges.find(({ node }) => node.name === 'accessSubjectId')?.node;
    if (!object || !accessField) throw new Error(`missing_access_field:${name}`);
    return { name, input: buildProjectRlsInput({
      roleId: role.id,
      objectMetadataId: object.id,
      accessSubjectFieldMetadataId: accessField.id,
      workspaceMemberIdFieldMetadataId: memberIdField.id,
    }) };
  });

  if (!apply) {
    console.log(JSON.stringify({ mode: 'dry-run', role: L7_ROLE_LABEL, objects: inputs.map(({ name }) => name), predicate: 'accessSubjectId IS currentWorkspaceMember.id' }));
    return;
  }

  const mutation = `mutation Upsert($input: UpsertRowLevelPermissionPredicatesInput!) { upsertRowLevelPermissionPredicates(input:$input) { predicates { id fieldMetadataId objectMetadataId operand workspaceMemberFieldMetadataId roleId } } }`;
  for (const { name, input } of inputs) {
    const result = await metadata(mutation, { input });
    const predicate = result.upsertRowLevelPermissionPredicates.predicates[0];
    if (!predicate || predicate.operand !== 'IS' || predicate.workspaceMemberFieldMetadataId !== memberIdField.id) {
      throw new Error(`rls_readback_failed:${name}`);
    }
  }
  console.log(JSON.stringify({ mode: 'applied', role: L7_ROLE_LABEL, predicateCount: inputs.length, readback: 'passed' }));
}

main().catch((error) => {
  console.error(`project-rls: ${error.message}`);
  process.exitCode = 1;
});
