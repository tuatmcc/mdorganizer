import { writeFile } from 'node:fs/promises';
import { glob } from 'glob';
import { join } from 'path';
import graymatter from 'gray-matter';

import { BaseConfig, OrganizerConfig, Post, PostConfig } from '@/type.d';
import { processMarkdown } from '@/lib/processer';

import { OrganizerInterface } from './interface';

export class Organizer implements OrganizerInterface {
  private organizerConfig: OrganizerConfig;
  private postType: string;
  private postGlobPattern: string;
  private pathList: string[] = [];
  private postList: Post[] = [];
  private outputFileName: string;

  constructor(baseConfig: BaseConfig, postConfig: PostConfig) {
    this.postType = postConfig.postType;
    this.postGlobPattern = postConfig.globPattern;
    this.outputFileName = join(baseConfig.outputDir, postConfig.postType);
  }

  public async compile(): Promise<Post[]> {
    await this.getUserConfig();
    await this.getPathList();
    this.postList = await Promise.all(
      this.pathList.map((path) => this.getPost(path)),
    );

    return this.postList;
  }

  private async getPathList(): Promise<void> {
    this.pathList = await glob(this.postGlobPattern).catch((error) => {
      throw new Error(error);
    });
  }

  private async getPost(rootPath: string): Promise<Post> {
    const { data, content } = graymatter.read(rootPath);
    const post: Post = {
      ...data,
      postType: this.postType,
      rootPath: rootPath,
      slug: rootPath.split('/'),
      markdown: content,
      html: await processMarkdown(content),
    };

    return post;
  }

  private async write() {
    try {
      await writeFile(this.outputFileName, JSON.stringify(this.postList));
    } catch (error) {
      throw new Error(error);
    }
  }

  private async getUserConfig() {
    // get config module from mdorganizer from project root with error handling
    try {
      const { organizerConfig } = await import('../../mdorganizer.config');
      this.organizerConfig = organizerConfig;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default Organizer;
