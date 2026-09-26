export const appConfig = {
  appName: 'Bank WorkDesk',
  aiProvider: process.env.AI_PROVIDER || 'local',
  aiModel: process.env.AI_MODEL || 'local-workdesk-assistant',
  aiBaseUrl: process.env.AI_BASE_URL || '',
  isAiConfigured: Boolean(process.env.AI_API_KEY),
  storageMode: process.env.STORAGE_BUCKET ? 'object-storage' : 'local-filesystem',
};
