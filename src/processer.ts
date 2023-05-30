import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified, Plugin } from 'unified';

export const processMarkdown = async (
  remarkRehypeOptions: Record<string, unknown>,
  remarkPlugins: Plugin[],
  rehypePlugins: Plugin[],
  markdown: string,
): Promise<string> => {
  const processer = unified();
  processer
    .use(remarkParse) // always use remark-parse to parse markdown to mdast
    .use(remarkPlugins) // user can pass in remark plugins
    .use(remarkRehype, {
      // always use remark-rehype to convert markdown to html
      ...remarkRehypeOptions,
      allowDangerousHtml: true,
    })
    .use(rehypePlugins); // user can pass in rehype plugins
  return processer.process(markdown).then((v) => v.toString());
};
