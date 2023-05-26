import { writeFile } from 'node:fs';
import { Organizer } from './organizer';
import { getUserConfig } from './config';
import { PostConfig } from './type';
import { generatePostType } from './gentypes';

export const run = async () => {
  const organizerConfig = await getUserConfig();
  const { postConfigs } = organizerConfig;

  // Generate post file
  const dataListPromise = postConfigs.map(async (postConfig: PostConfig) => {
    const organizer = new Organizer(postConfig);
    const postList = await organizer.compile();
    return `export const ${postConfig.postType} = ${JSON.stringify(postList)};`;
  });
  const compiledDataList: string[] = await Promise.all(dataListPromise);
  writeFile(
    `${process.cwd()}/.mdorganizer/post.ts`,
    compiledDataList.join('\n\n'),
    (err) => {
      if (err) throw err;
      console.log('The post file has been generated!');
    },
  );

  // Generate type file
  const postTypeList: string[] = postConfigs.map((postConfig) => {
    return generatePostType(postConfig);
  });
  writeFile(
    `${process.cwd()}/.mdorganizer/type.ts`,
    postTypeList.join('\n'),
    (err) => {
      if (err) throw err;
      console.log('The type file has been generated!');
    },
  );

  // Generate index file
  writeFile(
    `${process.cwd()}/.mdorganizer/index.ts`,
    `export * from './post';\nexport * from './type';`,
    (err) => {
      if (err) throw err;
      console.log('The index file has been generated!');
    },
  );
};
