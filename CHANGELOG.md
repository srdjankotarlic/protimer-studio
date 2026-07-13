# Changelog

All notable changes to ProTimer Studio are documented here.

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
