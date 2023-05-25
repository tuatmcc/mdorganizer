import { writeFile } from 'node:fs';
import { Organizer } from './organizer';
import { getUserConfig } from './config';
import { PostConfig } from './type';

const run = async () => {
  const organizerConfig = await getUserConfig();
  const { postConfigs } = organizerConfig;
  const dataListPromise = postConfigs.map(async (postConfig: PostConfig) => {
    const organizer = new Organizer(postConfig);
    const postList = await organizer.compile();
    return `export const ${postConfig.postType} = ${JSON.stringify(postList)};`;
  });
  const compiledDataList: string[] = await Promise.all(dataListPromise);
  writeFile(
    `${process.cwd()}/.mdorganizer/index.ts`,
    compiledDataList.join('\n'),
    (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    },
  );
};

export default run;
