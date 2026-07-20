# Test strategy

## Headless module suite

```bash
npm test
```

Runs 93 checks across lower-third packages, show storage and recovery data, portable show packages, preflight, screen-content models, control API normalization, post-show reports, pure output-routing rules, localization, build provenance, signing preflight and exact-artifact release evidence. This suite is deterministic and runs in GitHub Actions.

## Local renderer suite

```bash
npm run test:renderers:philips
```

Runs five real Electron renderer workflows. Every visible test window resolves the configured `PHL 243V7` display and aborts if that monitor is unavailable. It must never fall back to the HP E24u G5 or another display.

## Responsive product matrix

```bash
npm run test:beta-ui
```

Checks the real operator workspace at 1440x900, 1280x800, 1024x700 and 900x600. It covers Standard, Compact, Advanced, panels, Output Routing, Lower Third Studio, wizard, preflight, slides, recovery and report workflows. Current expected result: 53/53.

## Full source and packaged smoke

```bash
npm run smoke:philips
npm run dist:mac
npm run smoke:packaged:philips
```

The source and packaged smoke suites cover Program state, timer/GO invariants, media/codecs, localization, simultaneous output routes, Lower Third runtime/editor behavior and responsive UI. They abort before opening the application when the configured Philips monitor is missing.

Focused routing verification is available as:

```bash
npm run smoke:output-routing
```

## Soak

```bash
npm run smoke:lt-soak
```

The soak waits for the expected runtime instance and stable rendered DOM. It does not pass based on a fixed sleep or merely visible container.

## Release evidence

Passing automated checks do not replace signing, notarization or Windows hardware QA. See [PUBLIC-BETA-VERIFICATION.md](PUBLIC-BETA-VERIFICATION.md) and [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md).

The manual **Build signed stable candidate** workflow is intentionally unusable without real protected signing secrets. It validates an exact stable tag, runs the headless suite, signs on native platform runners, verifies notarization or Authenticode timestamps, attests the binaries and creates a private draft release.

The separate **Publish verified stable release** workflow remains blocked until `release-evidence/<version>.json` binds that exact candidate's hashes to designated-display smoke, physical Mac/Windows installation, external operator beta and release-document review. See [release evidence](../release-evidence/README.md).

Both beta and stable package jobs run `npm run check:packaged-free -- PATH/TO/app.asar` against the actual Mac and Windows archive, rather than inferring packaged contents from the source tree.
