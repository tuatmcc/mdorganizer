import { program } from 'commander';
import { UserConfig } from '@/types';
import { MdOrganizer } from './mdorganizer';
import { getConfig } from './config';

export const generate = async (userConfig: UserConfig): Promise<void> => {
  const mdOrganizer = new MdOrganizer(userConfig);
  await mdOrganizer.generateGeneratedFolder();
  await mdOrganizer.generateAllCategoryTypeFiles();
  await mdOrganizer.generateAllModules();
  await mdOrganizer.generateIndexFiles();
  console.log('All files generated!');
};

export const main = async () => {
  program
    .action(async () => {
      try {
        const config = await getConfig();
        await generate(config);
      } catch (err) {
        console.error(err);
      }
    })
    .parse(process.argv);
};
