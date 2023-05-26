#!usr/bin/env node

import { run } from '../dist/index.bundle.js';
run().catch((e) => console.error(e));
