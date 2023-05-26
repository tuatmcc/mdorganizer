import { readdirSync } from 'node:fs';
import { OrganizerConfig } from './type';

export const getUserConfig = async (): Promise<OrganizerConfig> => {
  const fileNames: string[] = readdirSync(process.cwd());

  const configFileName = fileNames.find((fileName) => {
    return fileName === 'mdorganizer.config.mjs';
  });
  
  if (!configFileName) {
    throw new Error('mdorganizer.config.mjs is not found');
  }

  const configModule = await import(`${process.cwd()}/${configFileName}`);
  const { default: organizerConfig } = configModule;
  return organizerConfig;
};
