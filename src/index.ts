import { writeFile, mkdir } from 'node:fs';
import { Organizer } from './organizer';
import { getUserConfig } from './config';
import type { PostConfig } from './type';
import { generatePostType } from './gentypes';

export const run = async () => {
  const organizerConfig = await getUserConfig();
  const { postConfigs } = organizerConfig;

  // if no .mdorganizer directory, create one
  mkdir(`${process.cwd()}/.mdorganizer`, (err) => {
    if (err) throw err;
  });

  // Generate post file
  const stringifiedPostList: string[] = await Promise.all(
    postConfigs.map(async (postConfig: PostConfig) => {
      const organizer = new Organizer(postConfig);
      const postList = await organizer.compile();
      return `export const all${postConfig.postType}: PostType${
        postConfig.postType
      }[] = ${JSON.stringify(postList)};`;
    }),
  );
  writeFile(
    `${process.cwd()}/.mdorganizer/post.ts`,
    `import type {${postConfigs
      .map((x) => `PostType${x.postType}`)
      .join(',')}} from './type';
${stringifiedPostList.join('\n\n')}
export const allPosts = [${postConfigs.map((x) => `...all${x.postType}`)}];`,
    (err) => {
      if (err) throw err;
      console.log('The post file has been generated!');
    },
  );

  // Generate type file
  const stringifiedTypeList: string[] = postConfigs.map((postConfig) => {
    return generatePostType(postConfig);
  });
  writeFile(
    `${process.cwd()}/.mdorganizer/type.ts`,
    stringifiedTypeList.join('\n'),
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
