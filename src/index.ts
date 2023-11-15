import { MdOrganizer } from './mdorganizer';

const config = await import('../tests/mock/mdorganizer.config');
const mdOrganizer = new MdOrganizer(config.default);
await mdOrganizer.generateGeneratedFolder();
await mdOrganizer.generateAllTypeFiles();
await mdOrganizer.generateAllModules();
await mdOrganizer.generateIndexFile();
