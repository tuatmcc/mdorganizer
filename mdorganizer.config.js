// import type { OrganizerConfig, Field } from './src/type';

/** @type {import('./src/type.d').Field} */
const metaField = {
  title: { type: 'string', required: true },
  date: { type: 'string', required: true },
  description: { type: 'string' },
  img: { type: 'string' },
  tags: { type: 'string[]' },
  author: { type: 'string' },
};

/** @type {import('./src/type.d').OrganizerConfig} */
const organizerConfig = {
  postConfigs: [
    {
      postType: 'blog',
      globPattern: 'content/blog/**/*/index.md',
      field: metaField,
    },
  ],
};

export default organizerConfig;
