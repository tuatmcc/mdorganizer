import { MetaFields } from '../mdorganizer.config';

export type Post = MetaFields & {
  postType: string;
  markdown: string;
  html: string;
};

export type PostConfig = {
  postType: string;
  globPattern: string;
};

export type BaseConfig = {
  outputDir: string;
};

export type OrganizerConfig = {
  baseConfig: BaseConfig;
  postConfigs: PostConfig[];
};

export type Fields = {
  [key: string]: string | string[] | undefined;
};
