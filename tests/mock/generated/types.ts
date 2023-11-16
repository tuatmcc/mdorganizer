export type BlogDocument = {
  documentCategory: string;
  globPattern: string;
  rootPath: string;
  content: string;
  fields: {
    title: string;
    date?: string;
    tags?: string[];
    num?: number;
    bool?: boolean;
  };
};
