#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');

const groups = {
  modules: [
    'test:lt-package',
    'test:show-storage',
    'test:show-package',
    'test:show-preflight',
    'test:screen-content',
    'test:control-api',
    'test:report',
    'test:output-routing'
  ],
  renderers: [
    'test:show-recovery',
    'test:show-setup-ui',
    'test:screen-content-ui',
    'test:control-api-ui',
    'test:report-ui'
  ]
};

const requested = process.argv[2] || 'modules';
const scripts = requested === 'all'
  ? [...groups.modules, ...groups.renderers]
  : groups[requested];

if (!scripts) {
  console.error(`Unknown suite "${requested}". Use modules, renderers, or all.`);
  process.exit(2);
}

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const startedAt = Date.now();

for (const script of scripts) {
  console.log(`\n=== ${script} ===`);
  const result = spawnSync(npm, ['run', script], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`\nTEST_SUITE_OK group=${requested} scripts=${scripts.length} durationMs=${Date.now() - startedAt}`);
