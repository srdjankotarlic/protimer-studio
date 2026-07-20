const { execFileSync } = require('child_process');

const platform = process.argv[2];

function has(...names) {
  return names.every((name) => Boolean(process.env[name]));
}

function hasMacIdentity() {
  if (process.env.CSC_LINK || process.env.CSC_NAME) return true;
  try {
    const identities = execFileSync(
      'security',
      ['find-identity', '-v', '-p', 'codesigning'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    return identities.includes('Developer ID Application:');
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`RELEASE_SIGNING_BLOCKED: ${message}`);
  process.exit(1);
}

if (platform === 'mac') {
  const hasNotaryApi = has('APPLE_API_KEY', 'APPLE_API_KEY_ID', 'APPLE_API_ISSUER');
  const hasAppleId = has('APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'APPLE_TEAM_ID');
  const hasKeychainProfile = has('APPLE_KEYCHAIN_PROFILE');

  if (!hasMacIdentity()) {
    fail('Developer ID Application identity or CSC_LINK/CSC_NAME is missing.');
  }
  if (!hasNotaryApi && !hasAppleId && !hasKeychainProfile) {
    fail('Apple notarization credentials are missing.');
  }
  console.log('RELEASE_SIGNING_READY: macOS signing and notarization inputs detected.');
  process.exit(0);
}

if (platform === 'win') {
  const hasWindowsCertificate =
    has('WIN_CSC_LINK', 'WIN_CSC_KEY_PASSWORD') ||
    has('CSC_LINK', 'CSC_KEY_PASSWORD');
  if (!hasWindowsCertificate) {
    fail('Windows signing certificate credentials WIN_CSC_LINK/WIN_CSC_KEY_PASSWORD (or CSC equivalents) are missing.');
  }
  console.log('RELEASE_SIGNING_READY: Windows signing inputs detected.');
  process.exit(0);
}

fail('Expected platform argument: mac or win.');
