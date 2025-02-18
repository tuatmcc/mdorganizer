import { readFile } from "node:fs/promises";
import type { CategoryConfig, FieldConfig, UserConfig } from "@/types";
import { glob } from "glob";
import graymatter from "gray-matter";

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
							documentId: `document__${crypto.randomUUID().replace(/-/g, "_")}`,
							generatedModuleString: await this.generate(path, categoryConfig),
						} satisfies DocumentModule;
					} catch (e) {
						console.warn(`Skipping ${path} due to error: ${e.message}`);
						return null;
					}
				}),
			);

			// filter out nulls
			documentModules = documentModules.filter(
				(documentModule) => documentModule !== null,
			);

			console.info(
				`Generated ${documentModules.length} modules for ${categoryConfig.documentCategory}`,
			);

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
	private typeValidators: Record<string, (value: unknown) => boolean> = {
		string: (value): boolean => typeof value === "string",
		"string[]": Array.isArray,
		number: (value): boolean => typeof value === "number",
		boolean: (value): boolean => typeof value === "boolean",
	};

	private validateFields(
		data: unknown,
		fields: Record<string, FieldConfig>,
	): void {
		for (const [key, value] of Object.entries(data)) {
			const fieldConfig = fields[key];

			if (!fieldConfig) {
				throw new Error(`Field ${key} does not exist`);
			}

			if (fieldConfig.required && !value) {
				throw new Error(`Field ${key} is required`);
			}

			const validator = this.typeValidators[fieldConfig.type];
			if (!validator(value)) {
				throw new Error(`Field ${key} must be a ${fieldConfig.type}`);
			}
		}
	}

	private escapeContent(content: string): string {
		return content
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&amp;/g, "&")
			.replace(/\\/g, "\\\\")
			.replace(/\r\n|\n/g, "\\n")
			.replace(/'/g, "\\'");
	}

	private serializeField(key: string, value: unknown): string {
		if (typeof value === "string") {
			return `${key}: "${value}"`;
		}
		if (Array.isArray(value)) {
			const items = value.map((item, i) => `${i === 0 ? "" : " "}"${item}"`);
			return `${key}: [${items}]`;
		}
		return `${key}: ${value}`;
	}

	async generate(
		rootPath: string,
		documentConfig: CategoryConfig,
	): Promise<string> {
		const { data, content } = graymatter(
			await readFile(rootPath, { encoding: "utf8" }),
		);

		this.validateFields(data, documentConfig.fields);

		// Apply after functions
		for (const [key, value] of Object.entries(data)) {
			const fieldConfig = documentConfig.fields[key];
			if (fieldConfig?.after) {
				data[key] = fieldConfig.after(value);
			}
		}

		const documentType =
			documentConfig.documentCategory.charAt(0).toUpperCase() +
			documentConfig.documentCategory.slice(1);

		const serializedFields = Object.entries(data)
			.map(([key, value]) => this.serializeField(key, value))
			.join(",\n    ");

		return `import type { ${documentType}Document } from "./types.d.ts";

export default {
  documentCategory: "${documentConfig.documentCategory}",
  globPattern: "${documentConfig.globPattern}",
  rootPath: "${rootPath}",
  content: "${this.escapeContent(content)}",
  fields: {
    ${serializedFields},
  },
} satisfies ${documentType}Document;`;
	}
}

export default ModuleGenerator;
