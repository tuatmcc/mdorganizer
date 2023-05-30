import { Plugin } from 'unified';

export type Field = {
  [key: string]: {
    type: 'string' | 'string[]' | 'string';
    required?: boolean;
  };
};

export type Post =
  | Field
  | {
      rootPath: string;
      postType: string;
      globPattern: string;
      markdown: string;
      html: string;
    };

export type PostConfig = {
  field: Field;
  postType: string;
  globPattern: string;
};

export type OrganizerConfig = {
  remarkRehypeOptions: Record<string, unknown>;
  remarkPlugins: Plugin[];
  rehypePlugins: Plugin[];
  postConfigs: PostConfig[];
};

export default OrganizerConfig;
