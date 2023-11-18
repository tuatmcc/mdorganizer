import { readFile } from 'fs/promises';
import { expect, it } from 'vitest';
import { DocumentCategoryType, TypeGenerator } from '../src/typegen';

it('generates type definitions', async () => {
  const config = await import('./mock/mdorganizer.config');
  const typeGenerator = new TypeGenerator(config.default);

  const file = await readFile('tests/mock/generated/types.ts', {
    encoding: 'utf8',
    flag: 'r',
  });

  const generated: DocumentCategoryType[] = typeGenerator.generateAll();

  const expected: DocumentCategoryType[] = [
    {
      documentCategory: 'blog',
      generatedTypeString: file,
    },
  ];

  expect(generated).toStrictEqual(expected);
});
