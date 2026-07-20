'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const signingScript = path.join(__dirname, '..', 'tools', 'assert-release-signing.js');
const signingKeys = [
  'CSC_LINK',
  'CSC_KEY_PASSWORD',
  'CSC_NAME',
  'WIN_CSC_LINK',
  'WIN_CSC_KEY_PASSWORD',
  'APPLE_API_KEY',
  'APPLE_API_KEY_ID',
  'APPLE_API_ISSUER',
  'APPLE_ID',
  'APPLE_APP_SPECIFIC_PASSWORD',
  'APPLE_TEAM_ID',
  'APPLE_KEYCHAIN',
  'APPLE_KEYCHAIN_PROFILE'
];

function run(platform, suppliedEnv = {}) {
  const env = { ...process.env };
  for (const key of signingKeys) delete env[key];
  Object.assign(env, suppliedEnv);
  return spawnSync(process.execPath, [signingScript, platform], {
    encoding: 'utf8',
    env
  });
}

function expectFailure(label, result, message) {
  assert.notStrictEqual(result.status, 0, `${label} unexpectedly passed`);
  assert.match(`${result.stdout}${result.stderr}`, message, `${label} failed unclearly`);
  console.log(`${label}=true`);
}

function expectSuccess(label, result, platform) {
  assert.strictEqual(result.status, 0, `${label}: ${result.stderr}`);
  assert.match(result.stdout, new RegExp(`RELEASE_SIGNING_READY: ${platform}`));
  console.log(`${label}=true`);
}

expectFailure('RELEASE_SIGNING_UNKNOWN_PLATFORM_BLOCKED_OK', run('other'), /Expected platform argument/);
expectFailure('RELEASE_SIGNING_MAC_IDENTITY_REQUIRED_OK', run('mac'), /identity.*missing/i);
expectFailure(
  'RELEASE_SIGNING_MAC_NOTARY_REQUIRED_OK',
  run('mac', { CSC_LINK: 'test-certificate' }),
  /notarization credentials are missing/i
);
expectSuccess(
  'RELEASE_SIGNING_MAC_API_KEY_READY_OK',
  run('mac', {
    CSC_LINK: 'test-certificate',
    APPLE_API_KEY: 'test-api-key',
    APPLE_API_KEY_ID: 'test-key-id',
    APPLE_API_ISSUER: 'test-issuer'
  }),
  'macOS'
);
expectSuccess(
  'RELEASE_SIGNING_MAC_APPLE_ID_READY_OK',
  run('mac', {
    CSC_LINK: 'test-certificate',
    APPLE_ID: 'release@example.com',
    APPLE_APP_SPECIFIC_PASSWORD: 'test-password',
    APPLE_TEAM_ID: 'TEAM123456'
  }),
  'macOS'
);
expectSuccess(
  'RELEASE_SIGNING_MAC_KEYCHAIN_PROFILE_READY_OK',
  run('mac', {
    CSC_LINK: 'test-certificate',
    APPLE_KEYCHAIN_PROFILE: 'protimer-notary'
  }),
  'macOS'
);
expectFailure('RELEASE_SIGNING_WINDOWS_CERT_REQUIRED_OK', run('win'), /certificate.*missing/i);
expectSuccess(
  'RELEASE_SIGNING_WINDOWS_DEDICATED_CERT_READY_OK',
  run('win', { WIN_CSC_LINK: 'test-certificate', WIN_CSC_KEY_PASSWORD: 'test-password' }),
  'Windows'
);
expectSuccess(
  'RELEASE_SIGNING_WINDOWS_SHARED_CERT_READY_OK',
  run('win', { CSC_LINK: 'test-certificate', CSC_KEY_PASSWORD: 'test-password' }),
  'Windows'
);

console.log('RELEASE_SIGNING_TESTS_OK count=9');
