# Signing and Release

ProTimer Studio has separate unsigned public-beta and signed stable-release paths. Beta packages are suitable for evaluation after checksum verification; stable packages require trusted platform signing and hardware QA.

## Current machine state

At the last local check, this Mac had no valid `Developer ID Application` identity and no Apple or Windows signing credentials in the process environment. The Mac QA command therefore applies only a local ad-hoc bundle signature so Electron can enforce embedded ASAR integrity. Ad-hoc signing is not a trusted public signature and cannot be notarized.

Never commit certificates, private keys or passwords. Inject them through the local keychain or protected CI secrets.

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
- alternative keychain profile: `APPLE_KEYCHAIN` + `APPLE_KEYCHAIN_PROFILE`.

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

References: [electron-builder code signing](https://www.electron.build/docs/features/code-signing/), [electron-builder macOS](https://www.electron.build/mac/), [Apple notarization](https://developer.apple.com/documentation/security/notarizing-macos-software-before-distribution).
