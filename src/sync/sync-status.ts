export const VDAI_SYNC_STATUS = {
  appVersion: '0.1.0',
  schemaContract: 'vdai-app-schema-v1',
  dataContract: 'vdai-portable-v1',
  mode: 'LOCAL_ONLY',
  sashaAccess: 'NOT_ISSUED',
  telegramCheckpoint: 356,
} as const;

export const VDAI_DATA_OWNERS = {
  codeAndSchema: 'GITHUB',
  liveProjectsTasksComments: 'CENTRAL_CRM',
  telegramMessages: 'TELEGRAM_SOURCE_CRM_PROJECTION',
  auditHistory: 'CENTRAL_CRM_APPEND_ONLY',
} as const;

