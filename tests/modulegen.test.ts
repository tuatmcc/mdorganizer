import { expect, it } from 'vitest';
import {
  CategoryModule as CategoryModule,
  ModuleGenerator,
} from '../src/modulegen';
import { readFile } from 'fs/promises';

it('generate modules', async () => {
  const config = await import('./mock/mdorganizer.config');
  const moduleGenerator = new ModuleGenerator(config.default);

  const rootPath = 'tests/mock/content/blog/hello/index.md';
  const file = await readFile(rootPath, {
    encoding: 'utf8',
    flag: 'r',
  });

  const generated: CategoryModule[] = await moduleGenerator.generateAll();

  const expected: CategoryModule[] = [
    {
      documentCategory: 'blog',
      documentModules: [
        {
          documentId: 'tests-mock-content-blog-hello-index',
          generatedModuleString: file,
        },
      ],
    },
  ];

  expect(generated).toStrictEqual(expected);
});
