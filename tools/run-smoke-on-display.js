#!/usr/bin/env node
// Portable smoke launcher that pins all test windows to a chosen display.
//   node tools/run-smoke-on-display.js --display Philips --source
//   node tools/run-smoke-on-display.js --display Philips --packaged
//   node tools/run-smoke-on-display.js --source --output-routing-only
// No arg-parsing dependency; forwards the display selector to main.js via --smoke-display.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
function val(flag) { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : null; }
const display = val('--display');
const displayId = val('--display-id');
const packaged = argv.includes('--packaged');
const root = path.join(__dirname, '..');
let config = {};
try { config = JSON.parse(fs.readFileSync(path.join(root, '.protimer-smoke-display.json'), 'utf8')); } catch (e) {}

const smokeArgs = ['--smoke'];
if (argv.includes('--output-routing-only')) smokeArgs.push('--output-routing-only');
const wantedId = displayId || (config && config.id);
const wantedLabel = display || (config && config.labelContains);
if (wantedId) smokeArgs.push('--smoke-display-id=' + wantedId);
else if (wantedLabel) smokeArgs.push('--smoke-display=' + wantedLabel);

let cmd, cmdArgs;
if (packaged) {
  // find the built .app and run its binary directly
  const appDir = path.join(root, 'dist-installers', 'mac-arm64', 'ProTimer Studio.app', 'Contents', 'MacOS', 'ProTimer Studio');
  if (!fs.existsSync(appDir)) {
    console.error('Packaged app not found: ' + appDir + '\nRun `npm run dist:mac` first.');
    process.exit(2);
  }
  cmd = appDir; cmdArgs = smokeArgs;
} else {
  cmd = path.join(root, 'node_modules', '.bin', 'electron');
  cmdArgs = ['.', ...smokeArgs];
}

console.log('LAUNCH ' + (packaged ? 'packaged' : 'source') + ' smoke: ' + cmd + ' ' + cmdArgs.join(' '));
const r = spawnSync(cmd, cmdArgs, { cwd: root, stdio: 'inherit' });
process.exit(r.status == null ? 1 : r.status);
