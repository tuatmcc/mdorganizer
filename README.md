# Markdown-Organizer

A CLI tool to convert markdown files into TypeScript modules, with fully typed front matter.

- Simple
  - Very Few dependencies
- Customizable
  - `globPattern` options for markdown files location
  - User defined front matter with type definition
- Fully Typed
  - TypeScript Only

## Usage

### Install

```sh
npm i -D mdorganizer
```

### Setup

1. Create `mdorganizer.config.ts` file.

```ts
import { UserConfig } from 'mdorganizer';

export default {
  documents: [
    {
      documentCategory: 'blog',
      globPattern: 'content/blog/**/*.md',
      fields: {
        title: {
          type: 'string',
          required: true,
        },
        tags: {
          type: 'string[]',
          after: (tags: string[]) => tags.map((tag) => tag.toLowerCase()),
        },
        author: {
          type: 'string',
        },
        img: {
          type: 'string'
        }
      },
    },
  ],
} satisfies UserConfig;
```

Available field types are `string`, `string[]`, `boolean`, `number`.

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

Or, you can run manually using `npx`.

```sh
npx mdorganizer
```

4. Organized files will be generated in `.mdorganizer` directory. You can import them in your code. (TypeScript Only)

Example of original markdown file

```md
---
title: Hello World
date: '2021-09-01'
description: This is a sample post.
img: /img/hello-world.png
tags: [sample, hello, world]
author: tuatmcc
---

# Hello World
```

Example usage of generated module

```ts
import type { BlogDocument } from '.mdorganizer/generated'; // import generated type
import { allBlogDocuments } from '.mdorganizer/generated'; // import generated modules

const {
  documentCategory,
  rootPath,
  fields,
  content,
} = allBlogDocuments[0];

const {
  title, // string
  date, // string
  img, // string | undefined
  tags, // string[] | undefined
  author, // string | undefined
} = feilds;
```

---

This package is inspired by [contentlayer](https://contentlayer.dev/).
