# Signing and Release

ProTimer Studio has separate unsigned public-beta and signed stable-release paths. Beta packages are suitable for evaluation after checksum verification; stable packages require trusted platform signing and hardware QA.

## Current machine state

At the last local check, this Mac had no valid `Developer ID Application` identity and no Apple or Windows signing credentials in the process environment. The Mac QA command therefore applies only a local ad-hoc bundle signature so Electron can enforce embedded ASAR integrity. Ad-hoc signing is not a trusted public signature and cannot be notarized.

Never commit certificates, private keys or passwords. Inject them through the local keychain or protected CI secrets.

## Automated stable release gate

`.github/workflows/stable-release.yml` is the only automated path that publishes a stable GitHub Release. It is manual and fail-closed. It accepts only an existing `vMAJOR.MINOR.PATCH` tag whose value matches `package.json`, whose commit is on `main`, and whose confirmation input is exactly `PUBLISH`.

Configure these protected GitHub Actions secrets before using it:

| Secret | Value |
|---|---|
| `MAC_CERT_P12_BASE64` | Base64-encoded Developer ID Application `.p12`. |
| `MAC_CERT_PASSWORD` | Password protecting that `.p12`. |
| `APPLE_API_KEY_P8_BASE64` | Base64-encoded App Store Connect API `.p8` key. |
| `APPLE_API_KEY_ID` | App Store Connect API key ID. |
| `APPLE_API_ISSUER` | App Store Connect issuer ID. |
| `WINDOWS_CERT_PFX_BASE64` | Base64-encoded exportable Authenticode `.pfx`. |
| `WINDOWS_CERT_PASSWORD` | Password protecting that `.pfx`. |

The workflow decodes credentials only into the ephemeral runner, builds natively on macOS and Windows, and refuses to publish unless all of these checks pass:

- package version, exact tag and `main` ancestry;
- deterministic tests and dependency audit;
- Developer ID authority, strict bundle verification, Gatekeeper assessment, notarization ticket and DMG integrity;
- Windows Authenticode status and trusted timestamp on the app, installer and portable executable;
- packaged CLI boot and hardened Electron fuses;
- SHA-256 checksums and GitHub provenance attestations.

Create and push a stable tag only after all product and hardware gates below pass. Then open **Actions → Build signed stable release → Run workflow**, enter the tag and type `PUBLISH`. Missing, malformed or invalid credentials stop the run before a release is created.

## macOS

Public distribution outside the Mac App Store requires:

1. Apple Developer Program membership and a `Developer ID Application` certificate.
2. Hardened Runtime.
3. Apple notarization credentials.
4. A successful Gatekeeper assessment after notarization and ticket stapling.

Supported electron-builder credential paths:

- signing: `CSC_LINK` + `CSC_KEY_PASSWORD`, or a valid Developer ID identity in the macOS keychain;
- preferred notarization API key: `APPLE_API_KEY` + `APPLE_API_KEY_ID` + `APPLE_API_ISSUER`;
- alternative Apple ID flow: `APPLE_ID` + `APPLE_APP_SPECIFIC_PASSWORD` + `APPLE_TEAM_ID`;
- alternative keychain profile: `APPLE_KEYCHAIN_PROFILE`, with optional `APPLE_KEYCHAIN`.

The repository includes explicit JIT/unsigned-executable-memory entitlements required by the Electron Hardened Runtime. It does not grant disabled-library-validation or App Sandbox exceptions that the current runtime does not need.

Local ad-hoc signed QA build:

```bash
npm run dist:mac
```

Signed and notarized release build:

```bash
npm run dist:mac:release
```

The release command fails before packaging if signing or notarization inputs are absent. After a successful build, verify the exact artifact:

```bash
codesign --verify --deep --strict --verbose=2 "dist-installers/mac-arm64/ProTimer Studio.app"
spctl --assess --type execute --verbose=2 "dist-installers/mac-arm64/ProTimer Studio.app"
xcrun stapler validate "dist-installers/ProTimer-Studio-*-arm64.dmg"
hdiutil verify "dist-installers/ProTimer-Studio-*-arm64.dmg"
```

Also inspect the packaged Electron fuses. `RunAsNode`, Node options and CLI inspect must be disabled; embedded ASAR integrity and OnlyLoadAppFromAsar must be enabled:

```bash
node node_modules/@electron/fuses/dist/bin.js read --app "dist-installers/mac-arm64/ProTimer Studio.app"
```

## Windows

Public distribution requires an Authenticode code-signing certificate. Provide either:

- `WIN_CSC_LINK` + `WIN_CSC_KEY_PASSWORD`; or
- `CSC_LINK` + `CSC_KEY_PASSWORD` when building only Windows artifacts.

Local unsigned cross-build:

```bash
npm run dist:win
```

Signed release build:

```bash
npm run dist:win:release
```

The final installer and portable executable must be checked on a clean physical Windows x64 machine. Validate signature details in file Properties and with `Get-AuthenticodeSignature`; run installation, first launch, output routing and uninstall before a stable public release.

## Stable release gate

Do not upload a package to a store until all of these are true:

- source and packaged smoke pass on the designated PHL 243V7 test display;
- the artifact is built from a clean, pushed commit;
- checksums and build metadata are recorded;
- macOS signing, notarization, stapling and Gatekeeper assessment pass;
- Windows signing and clean-machine QA pass for Windows packages;
- known limitations and system requirements match the actual artifact;
- an external operator beta has completed without a release-blocking issue.

The GitHub Actions beta workflow intentionally publishes unsigned prereleases with SHA-256 checksums and clear operating-system warnings. It does not label those artifacts as signed or production-certified.

Future beta and stable workflows also create GitHub provenance attestations for the binaries. Users can verify a downloaded artifact with:

```bash
gh attestation verify PATH/TO/ARTIFACT -R srdjankotarlic/protimer-studio
```

References: [electron-builder code signing](https://www.electron.build/docs/features/code-signing/), [electron-builder macOS](https://www.electron.build/mac/), [Apple notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution).
