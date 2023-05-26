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
  postConfigs: PostConfig[];
};

export default OrganizerConfig;
