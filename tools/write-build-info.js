const fs = require('fs');
const path = require('path');
const { createBuildInfo } = require('../src/release/build-info.js');

const root = path.resolve(__dirname, '..');
const info = createBuildInfo(root);

fs.writeFileSync(path.join(root, 'build-info.json'), JSON.stringify(info, null, 2) + '\n');
console.log('BUILD_INFO ' + JSON.stringify(info));
