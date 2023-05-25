import rehypeFormat from 'rehype-format';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode, { Options } from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const rpcOptions: Partial<Options> = {
  theme: 'github-dark',
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ['word--highlighted'];
  },
};

export const processMarkdown = async (markdown: string): Promise<string> => {
  const processer = unified();
  processer
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, rpcOptions)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .use(rehypeKatex)
    .use(rehypeFormat);
  return processer.process(markdown).then((v) => v.toString());
};

export default processMarkdown;
