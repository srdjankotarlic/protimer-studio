# ProTimer Studio 0.9.0 Beta 2

Beta 2 focuses on reliability, operator clarity and honest public testing.

## What changed

- Matching left and right sidebar toggles keep navigation and utility controls explicit; responsive drawers preserve access from 1440x900 down to 900x600.
- Rundown rows now keep names, LT/LIVE/SELECTED badges, schedule and duration readable without overlap.
- Scene dragging and resize behavior are more stable.
- Product screenshots, icon validation and release metadata now match the tested build.
- The runtime is upgraded to Electron 43.1.1.
- Smoke tests now use isolated browser profiles and separate source/packaged artifact directories.
- Packaged media no longer triggers an unnecessary macOS Safe Storage Keychain prompt.

## Verified on Apple Silicon Mac

The complete source and packaged suites each passed **320/320 checks** on the designated `PHL 243V7` display, with no test window on the HP display. The run covered timer/GO state, responsive operator access, multi-output routing, screen content, local network views and the full Lower Third Studio Preview/Take/Hide workflow.

Packaged fixtures also proved PNG/JPG/SVG rendering, MP4 playback and WebM VP8/VP9 alpha compositing inside Electron. This does not certify external OBS or vMix alpha behavior.

## Downloads

- `ProTimer-Studio-0.9.0-beta.2-arm64.dmg`: Apple Silicon Mac.
- `ProTimer-Studio-Setup-0.9.0-beta.2.exe`: Windows 10/11 x64 installer.
- `ProTimer-Studio-0.9.0-beta.2-portable.exe`: Windows 10/11 x64 without installation.
- `SHA256SUMS.txt`: integrity checksums for all downloads.

## Important beta notes

The packages are not Developer ID/notarized or Windows Authenticode signed. macOS Gatekeeper and Windows SmartScreen may warn on first launch. Confirm the GitHub source and verify the SHA-256 checksum before overriding a warning.

The Windows packages are built and inspected by the native GitHub Actions runner but have not completed physical Windows QA. Intel Mac is not published. NDI, window capture and external OBS/vMix alpha integration are not certified features.

Test the exact show computer, displays, network and media path off-air before a live event. Start at the [product page](https://srdjankotarlic.github.io/protimer-studio/), use the [public beta discussion](https://github.com/srdjankotarlic/protimer-studio/discussions/1), or send a reproducible [bug report](https://github.com/srdjankotarlic/protimer-studio/issues/new?template=bug_report.yml).
