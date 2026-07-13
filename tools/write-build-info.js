const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');

function git(args, fallback) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch (e) {
    return fallback;
  }
}

const info = {
  commit: git(['rev-parse', '--short', 'HEAD'], 'unknown'),
  branch: git(['branch', '--show-current'], 'unknown'),
  buildTimestamp: new Date().toISOString(),
  source: 'electron-builder'
};

fs.writeFileSync(path.join(root, 'build-info.json'), JSON.stringify(info, null, 2) + '\n');
console.log('BUILD_INFO ' + JSON.stringify(info));
