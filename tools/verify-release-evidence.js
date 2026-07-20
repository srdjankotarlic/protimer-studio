#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { validateReleaseEvidence } = require('../src/release/evidence.js');

const args = process.argv.slice(2);
const evidencePath = args[0] ? path.resolve(args[0]) : '';

function value(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : '';
}

function fail(message) {
  console.error(`RELEASE_EVIDENCE_BLOCKED: ${message}`);
  process.exit(1);
}

if (!evidencePath || !fs.existsSync(evidencePath) || !fs.statSync(evidencePath).isFile()) {
  fail('evidence JSON file does not exist');
}

let document;
try {
  document = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
} catch (error) {
  fail(`cannot parse evidence JSON: ${error.message}`);
}

const checksumPath = value('--checksums');
let checksums = '';
if (checksumPath) {
  const absoluteChecksumPath = path.resolve(checksumPath);
  if (!fs.existsSync(absoluteChecksumPath) || !fs.statSync(absoluteChecksumPath).isFile()) {
    fail('checksum manifest does not exist');
  }
  checksums = fs.readFileSync(absoluteChecksumPath, 'utf8');
}

const result = validateReleaseEvidence(document, {
  tag: value('--tag'),
  commit: value('--commit'),
  checksums
});

if (!result.ok) fail(result.errors.join('; '));
console.log(
  `RELEASE_EVIDENCE_OK=true tag=${document.releaseTag} commit=${document.commit} `
  + `candidateRunId=${document.candidateRunId} artifacts=${Object.keys(document.artifacts).length}`
);
