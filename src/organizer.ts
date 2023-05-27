import { glob } from 'glob';
import graymatter from 'gray-matter';

import { Field, Post, PostConfig } from './type';
import { processMarkdown } from './processer';

export class Organizer {
  private postConfig: PostConfig;
  private pathList: string[] = [];
  private postList: Post[] = [];

  constructor(postConfig: PostConfig) {
    this.postConfig = postConfig;
  }

  private async getPathList(): Promise<void> {
    const { globPattern } = this.postConfig;
    this.pathList = await glob(globPattern).catch((error) => {
      throw new Error(error);
    });
  }

  private async getPost(rootPath: string): Promise<Post> {
    const { data, content } = graymatter.read(rootPath);
    const metaField = data as Field;
    const { postType } = this.postConfig;
    // need to be consistent with generated post type in gentypes.ts
    const post: Post = {
      ...metaField,
      rootPath: rootPath,
      postType: postType,
      globPattern: this.postConfig.globPattern,
      markdown: content,
      html: await processMarkdown(content),
    };

    return post;
  }

  public async compile(): Promise<Post[]> {
    await this.getPathList();
    this.postList = await Promise.all(
      this.pathList.map((path) => this.getPost(path)),
    );

    return this.postList;
  }
}
