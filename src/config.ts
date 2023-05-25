import { OrganizerConfig } from './type';

export const getUserConfig = async (): Promise<OrganizerConfig> => {
  const configModule = await import(`${process.cwd()}/mdorganizer.config.js`);
  const { default: organizerConfig } = configModule;
  return organizerConfig;
};
