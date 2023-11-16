import { TypeGenerator } from './typegen';
import { ModuleGenerator } from './modulegen';
import { type DocumentConfig, type UserConfig } from './types';
import { writeFile, mkdir } from 'fs/promises';

export class MdOrganizer {
  private typeGenerator: TypeGenerator;
  private moduleGenerator: ModuleGenerator;
  private documentConfigs: DocumentConfig[];

  constructor(config: UserConfig) {
    this.typeGenerator = new TypeGenerator(config);
    this.moduleGenerator = new ModuleGenerator(config);
    this.documentConfigs = config.documents;
  }

  async generateGeneratedFolder(): Promise<void> {
    await mkdir('.mdorganizer/generated', { recursive: true });
    for (const config of this.documentConfigs) {
      await mkdir(`.mdorganizer/generated/${config.documentCategory}`, {
        recursive: true,
      });
    }
    return;
  }

  /**
   * @memberof MdOrganizer
   * @description Generates all category/types.ts files.
   * @returns {Promise<void>}
   */
  async generateAllCategoryTypeFiles(): Promise<void> {
    const types = this.typeGenerator.generateAll();
    for (const type of types) {
      await writeFile(
        `.mdorganizer/generated/${type.documentCategory}/types.ts`,
        type.generatedTypeString,
        { flag: 'w+' },
      );
    }
    return;
  }

  async generateAllModules(): Promise<void> {
    const categoryModules = await this.moduleGenerator.generateAll();
    for (const categoryModule of categoryModules) {
      for (const doc of categoryModule.documentModules) {
        await writeFile(
          `.mdorganizer/generated/${categoryModule.documentCategory}/${doc.documentId}.ts`,
          doc.generatedModuleString,
          { flag: 'w+' },
        );
      }

      // category/index.ts
      let imports = '';
      let exports = `export const all${
        categoryModule.documentCategory.charAt(0).toUpperCase() +
        categoryModule.documentCategory.slice(1)
      }Documents = [\n`;
      for (const documentModule of categoryModule.documentModules) {
        imports += `import ${documentModule.documentId} from './${documentModule.documentId}';\n`;
        exports += `  ${documentModule.documentId},\n`;
      }
      exports += '];\n';
      await writeFile(
        `.mdorganizer/generated/${categoryModule.documentCategory}/index.ts`,
        `${imports}\n${exports}`,
      );
    }
    return;
  }

  async generateIndexFiles(): Promise<void> {
    await writeFile(
      '.mdorganizer/generated/type.d.ts',
      this.documentConfigs
        .map((documentConfig) => {
          return `export * from './${documentConfig.documentCategory}/types';\n`;
        })
        .join('\n'),
      {
        flag: 'w+',
      },
    );

    await writeFile(
      '.mdorganizer/generated/index.ts',
      this.documentConfigs
        .map((documentConfig) => {
          return `export * from './${documentConfig.documentCategory}';\n`;
        })
        .join('\n'),
      {
        flag: 'w+',
      },
    );

    return;
  }
}
