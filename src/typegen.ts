import type { CategoryConfig, UserConfig } from "@/types";

export type DocumentCategoryType = {
	documentCategory: string;
	generatedTypeString: string;
};

export class TypeGenerator {
	private categoryConfigs: CategoryConfig[];
	private generatedTypes: DocumentCategoryType[] = [];

	constructor(config: UserConfig) {
		this.categoryConfigs = config.documents;
	}

	generateAll(): DocumentCategoryType[] {
		this.generatedTypes = this.categoryConfigs.map((docsumentConfig) => {
			return {
				documentCategory: docsumentConfig.documentCategory,
				generatedTypeString: this.generate(docsumentConfig),
			};
		});
		return this.generatedTypes;
	}

	generate(categoryConfig: CategoryConfig): string {
		// Make sure the document type is capitalized
		const documentCategory =
			categoryConfig.documentCategory.charAt(0).toUpperCase() +
			categoryConfig.documentCategory.slice(1);
		let fields = `export type ${documentCategory}Document = {
  documentCategory: string;
  globPattern: string;
  rootPath: string;
  content: string;
  fields: {\n`;
		for (const key in categoryConfig.fields) {
			const fieldConfig = categoryConfig.fields[key];
			const required = fieldConfig.required ? "" : "?";
			fields += `    ${key}${required}: ${fieldConfig.type};\n`;
		}
		fields += "  };\n";
		fields += "};\n";
		return fields;
	}
}
