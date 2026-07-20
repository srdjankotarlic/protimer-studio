# Changelog

All notable changes to ProTimer Studio are documented here.

## Unreleased

### Changed

- Upgraded the development runtime from Electron 42.6.1 to current stable Electron 43.1.1.
- Upgraded the ZIP package stack to Archiver 8.0.0 and yauzl 3.4.0 while preserving show/template package validation contracts.
- Added explicit macOS Hardened Runtime entitlements and encrypted Chromium cookie storage in packaged builds.
- Added a fail-closed signed stable-release workflow for Developer ID/notarized Mac and Authenticode-signed Windows artifacts.
- Added GitHub artifact provenance attestations to future beta and stable release pipelines.
- Added a packaged `app.asar` contract that blocks release artifacts containing activation code, key generators or private keys.

### Verification pending

- Electron 43.1.1 has passed the headless suite and a local Apple Silicon package/CLI/DMG/fuse check. The full designated-display source and packaged regression remains required before the next published beta.
- The stable workflow cannot produce or publish a stable release until real signing credentials are installed and both signature-verification jobs pass.

## 0.9.0-beta.1 - Public beta

### Added

- Rundown-first timer workflow with explicit selected, NEXT and LIVE cue states.
- Multiple simultaneous Program destinations with fullscreen, window, exact custom-size and grid placement.
- Lower Third Studio templates with dynamic/static text, shapes, logos, image/video media, Preview, Take and Hide.
- Screen content workflow for images, video, PDF, text, logos, timer and blank items.
- Local browser output, phone remote, backstage view and podium Signal Light.
- Atomic autosave, crash recovery, portable show/template packages and preflight.
- HTTP/OSC control surface and post-show timing report/CSV export.
- English and Serbian full localization plus 35 labeled core language packs.

### Changed

- Rebuilt the operator workspace for consistent responsive access from 1440x900 down to 900x600.
- Unified product identity, icon, package names and release metadata as ProTimer Studio.
- Hardened display identity and output reconnection so missing routes never move silently to another monitor.
- Upgraded the runtime from end-of-support Electron 39 to supported Electron 42.6.1.
- Hardened packaged Electron fuses and enforced embedded ASAR integrity on macOS and Windows.
- Removed the activation/trial gate and released the project under the MIT License.

### Release blockers

- Public macOS distribution still requires Developer ID signing, notarization and clean-machine validation.
- Windows artifacts require Authenticode signing and physical Windows QA.
- Electron 42.6.1 still requires the complete designated-display source and packaged regression pass.
- External OBS/vMix alpha workflows are not certified.
