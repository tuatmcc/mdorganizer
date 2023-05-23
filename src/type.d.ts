export type DocumentType = 'blog' | 'news';

export type RawField = {
  title: string;
  date: string;
  description?: string;
  img?: string;
  tags?: string[];
  author?: string;
};

export type ComputedField = RawField & {
  // override as required
  description: string;
  img: string;
  // additional fields
  documentType: DocumentType;
  slug: string[];
  rootPath: string;
};

export type Post = ComputedField & {
  markdown: string;
  html: string;
};
