export type FieldTypeString = "string" | "string[]" | "number" | "boolean";

export type FieldType = string | string[] | number | boolean;

/**
 * @abstract Base type for all user-defined fields
 * @property {string} type - The type of the field
 * @property {boolean} required - Whether the field is required
 * @property {Function} after - A function to run on the field after it is parsed
 */
export type FieldConfig = {
	type: FieldTypeString;
	required?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	after?: (value: any) => typeof value;
};

export type CategoryConfig = {
	globPattern: string;
	documentCategory: string;
	fields: {
		[key: string]: FieldConfig;
	};
};

/**
 * @abstract Base type for all user-defined documents
 */
export type Document = {
	globPattern: string;
	documentCategory: string;
	rootPath: string;
	content: string;
	fields: {
		[key: string]: FieldConfig;
	};
};

export type UserConfig = {
	documents: CategoryConfig[];
};
