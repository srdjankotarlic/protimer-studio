#!/usr/bin/env node
'use strict';

const path = require('path');
const { classifyTag } = require('../src/release/evidence.js');

const wantedKind = process.argv[2];
const tag = process.argv[3];
const pkg = require(path.join(process.cwd(), 'package.json'));
const expectedTag = `v${pkg.version}`;

function fail(message) {
  console.error(`RELEASE_TAG_BLOCKED: ${message}`);
  process.exit(1);
}

if (!['beta', 'stable'].includes(wantedKind)) fail('expected release kind: beta or stable');
if (classifyTag(tag) !== wantedKind) fail(`tag ${tag || '(missing)'} is not a valid ${wantedKind} tag`);
if (tag !== expectedTag) fail(`tag ${tag} does not match package version ${expectedTag}`);

console.log(`RELEASE_TAG_OK=true kind=${wantedKind} tag=${tag}`);
