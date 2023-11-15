import { TypeGenerator } from './typegen';
import { ModuleGenerator } from './modulegen';
import { type DocumentConfig, type UserConfig } from './types';
import { readFile, writeFile, mkdir } from 'fs/promises';

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
    const modules = await this.moduleGenerator.parseAll();
    for (const module of modules) {
      for (const doc of module.documentModules) {
        await writeFile(
          `.mdorganizer/generated/${module.documentCategory}/${doc.path}.ts`,
          doc.generatedModuleString,
          { flag: 'w+' },
        );
      }

      await writeFile(
        `.mdorganizer/generated/${module.documentCategory}/index.ts`,
        module.documentModules.map((doc) => {
          return `export * from './${doc.path}';\n`;
        }),
      );
    }
    return;
  }

  async generateIndexFiles(): Promise<void> {
    let indexFile = '';
    for (const doc of this.documentConfigs) {
      indexFile += `export * from './${doc.documentCategory}/types';\n`;
    }
    await writeFile('.mdorganizer/generated/type.d.ts', indexFile, {
      flag: 'w+',
    });
    for (const doc of this.documentConfigs) {
      indexFile = '';
      for (const module of doc.documentCategory) {
        indexFile += `export * from './${doc.documentCategory}/${module}';\n`;
      }
      await writeFile(
        `.mdorganizer/generated/${doc.documentCategory}/index.ts`,
        indexFile,
        { flag: 'w+' },
      );
    }
    return;
  }
}
