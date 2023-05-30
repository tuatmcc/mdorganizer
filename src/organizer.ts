import { glob } from 'glob';
import graymatter from 'gray-matter';

import { Field, Post, PostConfig } from './type';
import { processMarkdown } from './processer';
import { Plugin } from 'unified';

export class Organizer {
  private postConfig: PostConfig;
  private pathList: string[] = [];
  private postList: Post[] = [];
  private remarkPlugins: Plugin[] = [];
  private rehypePlugins: Plugin[] = [];
  private remarkRehypeOptions: Record<string, unknown> = {};

  constructor(
    postConfig: PostConfig,
    remarkRehypeOptions: Record<string, unknown>,
    remarkPlugins: Plugin[],
    rehypePlugins: Plugin[],
  ) {
    this.postConfig = postConfig;
    this.remarkRehypeOptions = remarkRehypeOptions;
    this.remarkPlugins = remarkPlugins;
    this.rehypePlugins = rehypePlugins;
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
      html: await processMarkdown(
        this.remarkRehypeOptions,
        this.remarkPlugins,
        this.rehypePlugins,
        content,
      ),
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
