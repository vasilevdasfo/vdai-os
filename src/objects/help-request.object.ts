import { defineObject, FieldType } from 'twenty-sdk/define';
import { FIELD_IDS, OBJECT_IDS } from 'src/domain/object-identifiers';

export default defineObject({
  universalIdentifier: OBJECT_IDS.helpRequest,
  nameSingular: 'vdaiHelpRequest', namePlural: 'vdaiHelpRequests', labelSingular: 'VDAI Help Request', labelPlural: 'VDAI Help Requests', icon: 'IconMessageQuestion',
  description: 'Explicit request for observation, critique, contribution or editing.',
  fields: [
    { universalIdentifier: FIELD_IDS.helpRequest[0], name: 'taskId', type: FieldType.UUID, label: 'Task portable ID' },
    { universalIdentifier: FIELD_IDS.helpRequest[1], name: 'requestedByRef', type: FieldType.TEXT, label: 'Requested by' },
    { universalIdentifier: FIELD_IDS.helpRequest[2], name: 'participantRef', type: FieldType.TEXT, label: 'Participant' },
    { universalIdentifier: FIELD_IDS.helpRequest[3], name: 'helpRole', type: FieldType.SELECT, label: 'Help role', defaultValue: "'COMMENTER'", options: [
      { value: 'OBSERVER', label: 'Observer', position: 0, color: 'gray' }, { value: 'COMMENTER', label: 'Commenter', position: 1, color: 'blue' }, { value: 'CONTRIBUTOR', label: 'Contributor', position: 2, color: 'green' }, { value: 'EDITOR', label: 'Editor', position: 3, color: 'yellow' },
    ] },
    { universalIdentifier: FIELD_IDS.helpRequest[4], name: 'request', type: FieldType.TEXT, label: 'Request' },
  ],
});
