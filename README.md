# Markdown-Organizer

A CLI tool to convert markdown files into TypeScript modules, with fully typed front matter and HTML.

- Simple
  - Very Few dependencies
- Customizable
  - `globPattern` options for markdown files location
  - User defined front matter with type definition
  - `rehype`, `remark` plugins
- Fully Typed
  - TypeScript Only
  - Fully typed front matter

## Usage

### Install

```sh
npm i mdorganizer
```

### Setup

1. Create `mdorganizer.config.mjs` file.

```js
import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

/** @type {import('./src/type.d').Field} */
const metaField = {
  title: { type: 'string', required: true },
  date: { type: 'string', required: true },
  description: { type: 'string' },
  img: { type: 'string' },
  tags: { type: 'string[]' },
  author: { type: 'string' },
};

/** @type {import('./src/type.d').OrganizerConfig} */
const organizerConfig = {
  remarkPlugins: [],
  rehypePlugins: [rehypeRaw, rehypeSanitize, rehypeStringify, rehypeFormat],
  postConfigs: [
    {
      postType: 'Blog',
      globPattern: 'content/blog/**/index.md',
      field: metaField,
    },
  ],
};

export default organizerConfig;
```

2. Add `npm scripts`

`package.json`(for example with Next.js)

```diff
...
  "scripts": {
+   "prebuild": "mdorganizer",
    "build": "next build",
  },
...
```

3. Run command

```sh
npm run build
```

`prebuild` script will be automatically run before `build`.

Or, you can run command directly.

```sh
npx mdorganizer
```

4. Organized files will be generated in `.mdorganizer` directory. You can import them in your code. (TypeScript Only)

Example of original markdown file

```md
---
title: Hello World
date: 2021-09-01
description: This is a sample post.
img: /img/hello-world.png
tags: [sample, hello, world]
author: tuatmcc
---

# Hello World
```

Example usage of generated module

```ts
import type { PostTypeBlog } from '.mdorganizer';
import { allBlog } from '.mdorganizer'; // allBlog is an array of PostTypeBlog

const {
  title, // string
  date, // string
  description, // string | undefined
  img, // string | undefined
  tags, // string[] | undefined
  author, // string | undefined
  rootPath, // string
  globPattern, // string
  postType, // string
  markdown, // string
  html, // string
} = allBlog[0];
```

## Features

We try to make this package as simple as possible. So, we won't have many features(such as direct integration for React Components).

[x] Convert markdown into HTML using `unified`, `rehype` and `remark`.
[x] Organize markdown files into TypeScript Modules.
[x] Custom `globPattern` options
[x] Custom front matter with type definition
[ ] Add type definition using `jsdoc` in `mdorganizer.config.mjs` file
[x] Custom `rehype`, `remark` plugins
[ ] Appropriate error handling

---

This package is inspired by [contentlayer](https://contentlayer.dev/).
