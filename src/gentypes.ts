import type { PostConfig, Field } from './type';

export const generatePostType = (postConfig: PostConfig) => {
  const { postType, globPattern, field } = postConfig;
  const typeName = `PostType${postType}`;

  const fieldString = Object.keys(field).map((key) => {
    const fieldItem = field[key as keyof Field];
    const { type, required } = fieldItem;
    const requiredString = required ? '' : '?';
    return `  ${key}${requiredString}: ${type};`;
  });

  return `export type ${typeName} = {
${fieldString.join('\n')}
  postType: '${postType}';
  globPattern: '${globPattern}';
  rootPath: string;
  markdown: string;
  html: string;
};\n`;
};
