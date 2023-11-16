#!/usr/bin/env node

import { main } from '../dist/index.bundle.js';
main().catch((e) => console.error(e));
