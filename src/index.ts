import { writeFileSync } from 'node:fs';

import { CompilePosts } from './core';

const compiler = new CompilePosts('blog');
compiler.compile().then((posts) => {
  writeFileSync('mdorganizer.json', JSON.stringify(posts));
});
