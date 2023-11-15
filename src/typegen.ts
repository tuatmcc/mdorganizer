import { DocumentConfig, UserConfig } from '@/types';

export type DocumentCategoryType = {
  documentCategory: string;
  generatedTypeString: string;
};

export class TypeGenerator {
  private documentConfigs: DocumentConfig[];
  private generatedTypes: DocumentCategoryType[] = [];

  constructor(config: UserConfig) {
    this.documentConfigs = config.documents;
  }

  generateAll(): DocumentCategoryType[] {
    this.generatedTypes = this.documentConfigs.map((docsumentConfig) => {
      return {
        documentCategory: docsumentConfig.documentCategory,
        generatedTypeString: this.generate(docsumentConfig),
      };
    });
    return this.generatedTypes;
  }

  generate(documentConfig: DocumentConfig): string {
    // Make sure the document type is capitalized
    const documentCategory =
      documentConfig.documentCategory.charAt(0).toUpperCase() +
      documentConfig.documentCategory.slice(1);
    let fields = `export type ${documentCategory}Document = {\n`;
    fields += `  documentCategory: string;\n`;
    fields += `  globPattern: string;\n`;
    fields += `  rootPath: string;\n`;
    fields += `  content: string;\n`;
    fields += `  fields: {\n`;
    for (const key in documentConfig.fields) {
      const fieldConfig = documentConfig.fields[key];
      const required = fieldConfig.required ? '' : '?';
      fields += `    ${key}${required}: ${fieldConfig.type};\n`;
    }
    fields += '  };\n';
    fields += '};\n';
    return fields;
  }
}
