'use strict';

const { execFileSync } = require('child_process');

function git(root, args, fallback = '') {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return fallback;
  }
}

function createBuildInfo(root, now = new Date()) {
  const commitFull = git(root, ['rev-parse', 'HEAD'], 'unknown');
  const commitShort = git(root, ['rev-parse', '--short', 'HEAD'], 'unknown');
  const branch = git(root, ['branch', '--show-current'], '') || 'detached';
  const dirty = Boolean(git(root, ['status', '--porcelain', '--untracked-files=normal'], ''));

  return {
    commit: `${commitShort}${dirty ? '-dirty' : ''}`,
    commitFull,
    branch,
    dirty,
    buildTimestamp: now.toISOString(),
    source: 'electron-builder'
  };
}

module.exports = { createBuildInfo };
