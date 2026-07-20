# ProTimer Studio Public Beta Known Limitations

- The public Mac beta has an ad-hoc bundle signature and is not Apple Developer ID signed or notarized. macOS can require explicit approval in Privacy & Security on first launch.
- The Mac beta is Apple Silicon only. Intel Mac packages are not currently published.
- The public Windows x64 installer and portable app are unsigned. Windows SmartScreen can show an Unknown publisher warning, and broader physical Windows hardware testing is still required.
- The published `0.9.0-beta.1` packages use Electron 42.6.1. Current `main` uses Electron 43.1.1 and passes module plus local Apple Silicon packaging checks, but the complete source/packaged display regression must be repeated before the next beta.
- A fail-closed stable signing workflow is present, but no signed stable artifact exists until real Apple and Windows credentials pass its native verification jobs.
- OBS and vMix browser-source workflows have not received a complete manual integration pass. Do not treat them as certified integrations.
- MP4 playback and WebM VP8/VP9 decoding are covered by local Electron tests. Reliable video alpha depends on codec, encoder and runtime behavior; video alpha is not certified for external production software in this beta.
- NDI, window capture, streaming/encoding, audio mixing and cloud collaboration are intentionally outside this beta scope.
- The app is designed for local/offline event operation. Online sharing through a tunnel depends on network access and the external tunnel service.
- Operators should run preflight and verify every physical display, media asset and lower-third animation before doors open.
