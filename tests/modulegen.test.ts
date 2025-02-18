import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { type CategoryModule, ModuleGenerator } from "../src/modulegen";

const documentIdPattern = /^document__[0-9a-f_]{36}$/;

it("generate modules", async () => {
	const config = await import("./mock/mdorganizer.config");
	const moduleGenerator = new ModuleGenerator(config.default);

	const file = await readFile(
		"tests/mock/generated/tests_mock_content_blog_hello_index.ts",
		{
			encoding: "utf8",
			flag: "r",
		},
	);

	const generated: CategoryModule[] = await moduleGenerator.generateAll();

	const expected: CategoryModule[] = [
		{
			documentCategory: "blog",
			documentModules: [
				{
					rootPath: "tests/mock/content/blog/hello/index.md",
					documentId: "document__mock_content_blog_hello_index",
					generatedModuleString: file.trim(),
				},
			],
		},
	];

	expect(generated.length).toBe(1);
	expect(generated[0].documentCategory).toBe("blog");
	expect(generated[0].documentModules.length).toBe(1);

	const generatedModule = generated[0].documentModules[0];
	expect(generatedModule.rootPath).toBe(
		"tests/mock/content/blog/hello/index.md",
	);

	// UUIDパターンのチェック
	expect(generatedModule.documentId).toMatch(documentIdPattern);

	// 生成された文字列の内容を正規化して比較
	// const normalizeString = (str: string) => str.replace(/\s+/g, " ").trim();

	expect(generatedModule.generatedModuleString).toBe(file);

	// UUIDを除外した構造の比較
	const expectedWithoutId = {
		...expected[0],
		documentModules: expected[0].documentModules.map(
			({ documentId, ...rest }) => rest,
		),
	};
	const generatedWithoutId = {
		...generated[0],
		documentModules: generated[0].documentModules.map(
			({ documentId, ...rest }) => rest,
		),
	};
	expect(generatedWithoutId).toStrictEqual(expectedWithoutId);
});
