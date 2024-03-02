import { BlogDocument } from './types';

export default {
  documentCategory: 'blog',
  globPattern: 'tests/mock/content/blog/**/index.md',
  rootPath: 'tests/mock/content/blog/hello/index.md',
  content: '\n# Hello World!\n',
  fields: {
    title: 'Hello World!',
    date: '2000-01-01',
    tags: ['hello', 'world'],
    bool: true,
    num: 1,
  },
} satisfies BlogDocument;
