import type { OrganizerConfig, Fields } from './src/type.d';

export const organizerConfig: OrganizerConfig = {
  baseConfig: {
    outputDir: '.mdorganizer',
  },
  postConfigs: [
    {
      postType: 'blog',
      globPattern: 'blog/**/*/index.md', // content/blog/**/*/index.md
    },
  ],
};

export interface MetaFields extends Fields {
  title: string;
  date: string;
  description?: string;
  img?: string;
  tags?: string[];
  author?: string;
}
