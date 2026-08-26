import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.proof,
  nameSingular: 'vdaiProof', namePlural: 'vdaiProofs', labelSingular: 'VDAI Proof', labelPlural: 'VDAI Proofs', icon: 'IconRosetteDiscountCheck',
  description: 'Artifact and independent review. A link alone is not accepted proof.',
  fields: [
    { universalIdentifier: FIELD_IDS.proof[0], name: 'taskId', type: FieldType.UUID, label: 'Task portable ID' },
    { universalIdentifier: FIELD_IDS.proof[1], name: 'artifactRef', type: FieldType.TEXT, label: 'Artifact reference' },
    { universalIdentifier: FIELD_IDS.proof[2], name: 'verifierRef', type: FieldType.TEXT, label: 'Verifier reference' },
    { universalIdentifier: FIELD_IDS.proof[3], name: 'verdict', type: FieldType.SELECT, label: 'Verdict', defaultValue: "'PENDING'", options: [
      { value: 'PENDING', label: 'Pending', position: 0, color: 'gray' }, { value: 'ACCEPTED', label: 'Accepted', position: 1, color: 'green' }, { value: 'REJECTED', label: 'Rejected', position: 2, color: 'red' },
    ] },
  ],
});
