import { BaseConfig, Post, PostConfig, OrganizerConfig } from '@/type.d';

export interface OrganizerInterface {
  organizerConfig: OrganizerConfig;
  postList: Post[];
  pathList: string[];
  postType: string;
  postGlobPattern: string;
  outputFileName: string;
  constructor(baseConig: BaseConfig, postConfig: PostConfig): void;
  compile(): Promise<Post[]>;
  write(): Promise<void>;
  generatePathList(): Promise<void>;
  getConfig(): Promise<void>;
}
