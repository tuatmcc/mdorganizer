import rehypeFormat from 'rehype-format';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

/** @type {import('./src/type.d').Field} */
const metaField = {
  title: { type: 'string', required: true },
  date: { type: 'string', required: true },
  description: { type: 'string' },
  img: { type: 'string' },
  tags: { type: 'string[]' },
  author: { type: 'string' },
};

/** @type {import('rehype-pretty-code').Options */
const rpcOptions = {
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
/** @type {import('./src/type.d').OrganizerConfig} */
const organizerConfig = {
  remarkPlugins: [
    remarkParse,
    [
      remarkRehype,
      {
        allowDangerousHtml: true,
      },
    ],
  ],
  rehypePlugins: [
    rehypeRaw,
    [rehypePrettyCode, rpcOptions],
    rehypeSanitize,
    rehypeStringify,
    rehypeKatex,
    rehypeFormat,
  ],
  postConfigs: [
    {
      postType: 'blog',
      globPattern: 'content/blog/**/index.md',
      field: metaField,
    },
  ],
};

export default organizerConfig;
