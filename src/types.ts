export type FieldTypeString = 'string' | 'string[]' | 'number' | 'boolean';

export type FieldType = string | string[] | number | boolean;

export type FieldConfig = {
  type: FieldTypeString;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  after?: (value: any) => typeof value;
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
