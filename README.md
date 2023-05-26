# Markdown-Organizer

A simple npm package to organize markdown files into TypeScript Modules.

Inspired by [contentlayer](https://contentlayer.dev/).

## Usage

### Install

```sh
npm i @tuatmcc/mdorganizer
```

### Setup

1. Create `mdorganizer.config.mjs` file.

```js
/** @type {import('@tuatmcc/mdorganizer').Field} <= this typing is not yet available */
const metaField = {
  // allowed field type is 'string' or 'string[]'
  title: { type: 'string', required: true },
  date: { type: 'string', required: true },
  description: { type: 'string' },
  img: { type: 'string' },
  tags: { type: 'string[]' },
  author: { type: 'string' },
};

/** @type {import('@tuatmcc/mdorganizer').OrganizerConfig} <= this typing is not yet abailable */
const organizerConfig = {
  postConfigs: [
    {
      postType: 'Blog', // this will be used in module name,as well as type alias
      globPattern: 'content/blog/**/index.md', // glob pattern to find markdown files(relative to project root)
      field: metaField, // front matter field
    },
    {
      postType: 'News',
      globPattern: 'content/news/**/index.md',
      field: metaField, // of course, you can use different field for each postType
    },
  ],
};

export default organizerConfig;
```

2. Add to `npm scripts`

`package.json`(for example with Next.js)

```diff
...
  "scripts": {
+   "prebuild": "mdorganizer",
    "build": "next build",
  },
...
```

3. Run npx command `mdorganizer` via `npm run prebuild`

```sh
npm run build
```

`prebuild` script will automatically run `mdorganizer` before `build` script.

4. Organized files will be generated in `.mdorganizer` directory. You can import them in your code. (TypeScript Only)

Example of original markdown file field

```md
---
title: Hello World
date: 2021-09-01
description: This is a sample post.
img: /img/hello-world.png
tags: [sample, hello, world]
author: tuatmcc
---
```

## Features

We try to make this package as simple as possible. So, we won't have many features(such as direct integration for React Components).

- [x] Convert markdown into HTML using `unified`, `rehype` and `remark`.
- [x] Organize markdown files into TypeScript Modules.
- [x] Custom `globPattern` options
- [x] Custom front matter with type definition
- [ ] Add type definition using `jsdoc` in `mdorganizer.config.mjs` file
- [ ] Custom `rehype`, `remark` plugins
- [ ] Appropriate error handling

## Examples

#### With Next.js `appRouter`

See [Our Homepage Repository](https://github.com/tuatmcc/homepage2.0).
