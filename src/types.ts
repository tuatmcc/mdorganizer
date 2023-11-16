export type FieldTypes = 'string' | 'string[]' | 'number' | 'boolean';

export type FieldConfig = {
  type: FieldTypes;
  required?: boolean;
  after?: (value: FieldTypes | unknown) => typeof value;
};

export type DocumentConfig = {
  globPattern: string;
  documentCategory: string;
  fields: {
    [key: string]: FieldConfig;
  };
};

/**
 * @abstract Base type for all user-defined documents
 */
export type Document = {
  globPattern: string;
  documentCategory: string;
  rootPath: string;
  content: string;
  fields: {
    [key: string]: FieldConfig;
  };
};

export type UserConfig = {
  documents: DocumentConfig[];
};
