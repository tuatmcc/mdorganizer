import { CategoryConfig, UserConfig } from '@/types';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import graymatter from 'gray-matter';
import { v4 } from 'uuid';

type DocumentModule = {
  rootPath: string;
  documentId: string;
  generatedModuleString: string;
};

export type CategoryModule = {
  documentCategory: string;
  documentModules: DocumentModule[];
};

export class ModuleGenerator {
  private categoryConfigs: CategoryConfig[];
  private categoryModules: CategoryModule[];

  constructor(userConfig: UserConfig) {
    this.categoryConfigs = userConfig.documents;
    this.categoryModules = [];
  }

  async generateAll(): Promise<CategoryModule[]> {
    for (const categoryConfig of this.categoryConfigs) {
      const paths = await glob(categoryConfig.globPattern);
      // generate modules for each document
      let documentModules = await Promise.all(
        paths.map(async (path) => {
          try {
            return {
              rootPath: path,
              documentId: `document__${v4().replace(/-/g, '_')}`,
              generatedModuleString: await this.generate(path, categoryConfig),
            } satisfies DocumentModule;
          } catch (e) {
            console.log(`Skipping ${path} due to error: ${e.message}`);
            return null;
          }
        }),
      );

      // filter out nulls
      documentModules = documentModules.filter((documentModule) => documentModule !== null);

      console.log(`Generated ${documentModules.length} modules for ${categoryConfig.documentCategory}`);

      this.categoryModules.push({
        documentCategory: categoryConfig.documentCategory,
        documentModules: documentModules,
      });
    }
    return this.categoryModules;
  }

  /**
   * @param {string} rootPath
   * @returns {string}
   * @memberof ModuleGenerator
   * @description
   * Parses a document and returns a stringified version of the Document.
   * The stringified version is a TypeScript object that can be imported
   * and used in the application.
   */
  async generate(rootPath: string, documentConfig: CategoryConfig): Promise<string> {
    const { data, content } = graymatter(await readFile(rootPath, { encoding: 'utf8' }));
    // validate data against FieldsConfig
    for (const key in data) {
      // check if key is exists in fields
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const fieldName = data[key];
        const fieldConfig = documentConfig.fields[key];
        if (fieldConfig) {
          // validate required fields
          if (fieldConfig.required && !fieldName) {
            throw new Error(`Field ${key} is required`);
          }
          // validate field types
          switch (fieldConfig.type) {
            case 'string':
              if (typeof fieldName !== 'string') {
                throw new Error(`Field ${key} must be a string`);
              }
              break;
            case 'string[]':
              if (!Array.isArray(fieldName)) {
                throw new Error(`Field ${key} must be an array`);
              }
              break;
            case 'number':
              if (typeof fieldName !== 'number') {
                throw new Error(`Field ${key} must be a number`);
              }
              break;
            case 'boolean':
              if (typeof fieldName !== 'boolean') {
                throw new Error(`Field ${key} must be a boolean`);
              }
              break;
            default:
              throw new Error(`Field ${key} has invalid type`);
          }
          // execute after function
          if (fieldConfig.after) {
            data[key] = fieldConfig.after(fieldName);
          }
        } else {
          throw new Error(`Field ${key} does not exist`);
        }
      }
    }

    const frontmatter = data;
    const documentType =
      documentConfig.documentCategory.charAt(0).toUpperCase() + documentConfig.documentCategory.slice(1);

    const result = `import type { ${documentType}Document } from './types.d.ts';

export default {
  documentCategory: '${documentConfig.documentCategory}',
  globPattern: '${documentConfig.globPattern}',
  rootPath: '${rootPath}',
  content: '${content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n/g, '\\n')
    .replace(/'/g, "\\'")}',
  fields: {
    ${Object.keys(frontmatter)
      .map((key) => {
        if (typeof frontmatter[key] === 'string') {
          return `${key}: '${frontmatter[key]}'`;
        } else if (Array.isArray(frontmatter[key])) {
          return `${key}: [${frontmatter[key].map(
            (item: string, index: number) => `${index === 0 ? '' : ' '}'${item}'`,
          )}]`;
        } else {
          return `${key}: ${frontmatter[key]}`;
        }
      })
      .join(',\n    ')},
  },
} satisfies ${documentType}Document;\n`;

    return result;
  }
}

export default ModuleGenerator;
