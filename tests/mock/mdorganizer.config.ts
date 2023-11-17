import { CategoryConfig } from '@/types';

const blog: CategoryConfig = {
  documentCategory: 'blog',
  globPattern: 'tests/mock/content/blog/**/index.md',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'string',
      after(value: string) {
        return value.toUpperCase();
      },
    },
    tags: {
      type: 'string[]',
    },
    num: {
      type: 'number',
    },
    bool: {
      type: 'boolean',
    },
  },
};

export default {
  documents: [blog],
};
