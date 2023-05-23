import { glob } from 'glob';
import graymatter from 'gray-matter';

import { processMarkdown } from './processer';
import { ComputedField, DocumentType, Post, RawField } from './type.d';

export class CompilePosts {
  private documentType: DocumentType;
  private paths: string[] = [];
  private Posts: Post[] = [];

  constructor(documentType: DocumentType) {
    this.documentType = documentType;
  }

  public async compile(): Promise<Post[]> {
    await this.getPaths();
    this.Posts = await Promise.all(
      this.paths.map((path) => this.getPost(path)),
    );

    return this.Posts;
  }

  private async getPaths(): Promise<void> {
    this.paths = await glob(`../content/${this.documentType}/**/*.md`).catch(
      (error) => {
        throw new Error(error);
      },
    );
  }

  private async getPost(rootPath: string): Promise<Post> {
    const { data, content } = graymatter.read(rootPath);
    const rawField = data as RawField;
    const computedField: ComputedField = {
      title: rawField.title,
      date: rawField.date,
      description: rawField.description || '',
      author: rawField.author || '',
      tags: rawField.tags,
      documentType: this.documentType,
      img: rawField.img || '',
      rootPath: rootPath,
      slug: rootPath.split('/'),
    };
    const post: Post = {
      ...computedField,
      markdown: content,
      html: await processMarkdown(content),
    };

    return post;
  }
}

export default CompilePosts;
