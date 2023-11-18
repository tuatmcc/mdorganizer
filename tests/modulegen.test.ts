import { readFile } from 'fs/promises';
import { expect, it } from 'vitest';
import { CategoryModule, ModuleGenerator } from '../src/modulegen';

it('generate modules', async () => {
  const config = await import('./mock/mdorganizer.config');
  const moduleGenerator = new ModuleGenerator(config.default);

  const file = await readFile('tests/mock/generated/tests_mock_content_blog_hello_index.ts', {
    encoding: 'utf8',
    flag: 'r',
  });

  const generated: CategoryModule[] = await moduleGenerator.generateAll();

  const expected: CategoryModule[] = [
    {
      documentCategory: 'blog',
      documentModules: [
        {
          rootPath: 'tests/mock/content/blog/hello/index.md',
          documentId: 'tests_mock_content_blog_hello_index',
          generatedModuleString: file.trim(),
        },
      ],
    },
  ];

  expect(generated).toStrictEqual(expected);
});
