import { program } from 'commander';
import { UserConfig } from '@/types';
import { MdOrganizer } from './mdorganizer';

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
    .option('--config <path>', 'path to config file')
    .action(async (options) => {
      const configPath = options.config
        ? options.config.replace(/\.ts$/, '')
        : 'mdorganizer.config';
      try {
        const config = await import(configPath);
        await generate(config.default);
      } catch (err) {
        console.error(
          'Could not find mdorganizer.config.ts in the current directory or the config path specified.',
        );
      }
    })
    .parse(process.argv);
};

main();
