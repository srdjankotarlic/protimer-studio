'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');

function decodeRgbaPng(filePath) {
  const input = fs.readFileSync(filePath);
  assert(input.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), filePath + ' is not a PNG');
  let offset = 8;
  let width = 0;
  let height = 0;
  const idat = [];
  while (offset < input.length) {
    const length = input.readUInt32BE(offset);
    const type = input.toString('ascii', offset + 4, offset + 8);
    const data = input.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      assert.strictEqual(data[8], 8, filePath + ' must use 8-bit channels');
      assert.strictEqual(data[9], 6, filePath + ' must use RGBA pixels');
      assert.strictEqual(data[12], 0, filePath + ' must be non-interlaced');
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    offset += 12 + length;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = Buffer.alloc(stride * height);
  let sourceOffset = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[sourceOffset++];
    for (let x = 0; x < stride; x++) {
      const value = raw[sourceOffset++];
      const left = x >= 4 ? pixels[y * stride + x - 4] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft = y > 0 && x >= 4 ? pixels[(y - 1) * stride + x - 4] : 0;
      let reconstructed = value;
      if (filter === 1) reconstructed += left;
      else if (filter === 2) reconstructed += up;
      else if (filter === 3) reconstructed += Math.floor((left + up) / 2);
      else if (filter === 4) {
        const prediction = left + up - upperLeft;
        const pa = Math.abs(prediction - left), pb = Math.abs(prediction - up), pc = Math.abs(prediction - upperLeft);
        reconstructed += pa <= pb && pa <= pc ? left : (pb <= pc ? up : upperLeft);
      } else assert.strictEqual(filter, 0, filePath + ' has an unsupported PNG filter');
      pixels[y * stride + x] = reconstructed & 255;
    }
  }
  return { width, height, pixels };
}

function alphaAt(image, x, y) {
  return image.pixels[(y * image.width + x) * 4 + 3];
}

function opaqueBounds(image, threshold = 240) {
  let minX = image.width, minY = image.height, maxX = -1, maxY = -1;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (alphaAt(image, x, y) < threshold) continue;
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY };
}

function checkPng(relativePath, expectedSize, checkCenter = false) {
  const image = decodeRgbaPng(path.join(root, relativePath));
  assert.strictEqual(image.width, expectedSize, relativePath + ' width');
  assert.strictEqual(image.height, expectedSize, relativePath + ' height');
  assert.strictEqual(alphaAt(image, 0, 0), 0, relativePath + ' top-left corner must be transparent');
  assert.strictEqual(alphaAt(image, expectedSize - 1, 0), 0, relativePath + ' top-right corner must be transparent');
  assert(alphaAt(image, Math.floor(expectedSize / 2), Math.floor(expectedSize / 2)) > 240, relativePath + ' center must be opaque');
  if (checkCenter) {
    const bounds = opaqueBounds(image);
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    assert(Math.abs(centerX - (expectedSize - 1) / 2) <= 3, relativePath + ' opaque tile must be horizontally centered');
    assert(Math.abs(centerY - (expectedSize - 1) / 2) <= 3, relativePath + ' opaque tile must be vertically centered');
  }
}

checkPng('build/icon.png', 1024, true);
checkPng('build/icon.iconset/icon_16x16.png', 16);
checkPng('build/icon.iconset/icon_128x128@2x.png', 256);
checkPng('site/assets/icon.png', 512, true);
assert(fs.statSync(path.join(root, 'build', 'icon.icns')).size > 10000, 'build/icon.icns is missing or empty');
console.log('ICON_ASSETS_CHECK_OK transparent=true centered=true');
