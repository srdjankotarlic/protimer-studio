# Public Beta Verification

Verified for `0.9.0-beta.1` on 2026-07-13.

## Passed in the public repository

- `npm ci`: clean install on Node.js 22.
- `npm audit`: 0 reported vulnerabilities.
- `npm test`: 59 deterministic module checks plus the free-build and public-site contracts.
- Public-site metadata: canonical URL, Open Graph/Twitter cards, SoftwareApplication/FAQ structured data, sitemap, robots file and local assets.
- Apple Silicon package: native ARM64 application, successful CLI boot, valid DMG checksum and valid ad-hoc bundle signature.
- Electron package hardening: RunAsNode, Node options and CLI inspect disabled; embedded ASAR integrity and OnlyLoadAppFromAsar enabled.
- Windows package structure: x64 unpacked application plus NSIS installer and portable executable produced successfully.
- Packaged-content audit: no activation module, license generator or private key in either Mac or Windows ASAR.

## Previously verified product baseline

Before the public free-build extraction, the same product runtime passed the designated-display source and packaged regression suites, the 53-check responsive operator matrix and a condition-driven 15-minute lower-third soak. Removing the activation gate did not change timer, GO, Program, output-routing or renderer protocols.

## Not yet proven for this public beta

- The complete visible source/packaged suite has not been repeated after extraction because the configured PHL 243V7 test display was not connected. The test guard correctly aborted before opening any window.
- Windows packages have not completed a clean physical Windows 10/11 install, launch, firewall, multi-display and uninstall pass.
- The packages are not Developer ID/notarized or Windows Authenticode signed.
- External OBS/vMix video-alpha workflows are not certified.
- Search-engine discovery and real operator adoption can only be measured after publication.

These gaps are why the release is labelled **public beta**, not stable or production-certified. Test the exact show computer, displays and media path before using it on-air.

## Work after Beta 1

Current `main` advances to Electron 43.1.1, 93 headless checks, explicit macOS entitlements and separate fail-closed signed-candidate/publication workflows. Native GitHub runners successfully build and inspect the actual Apple Silicon DMG, Windows installer and Windows portable package, including the packaged MIT/free-build contract. A local Apple Silicon package also passes CLI boot, DMG integrity, ad-hoc signature and fuse checks.

The designated-display inventory on 2026-07-20 found only the Built-in Retina Display, so no visible test was opened and the PHL 243V7 source/packaged gate remains pending. These post-release checks do not retroactively change the published Beta 1 artifact and do not replace physical Windows installation or external operator testing.
