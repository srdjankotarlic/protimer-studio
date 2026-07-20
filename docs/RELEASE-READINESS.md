# Release readiness

Status audited against the public `main` branch on 2026-07-20. `PROVEN` means current retained evidence covers the claim; `PENDING` means the requirement is not complete and must not be marketed as complete.

| Requirement | Status | Current evidence | Remaining gate |
|---|---|---|---|
| Public source and usage rights | PROVEN | Public GitHub repository, MIT `LICENSE`, source and packaged free-build checks. | None for beta use. |
| Recoverable source history | PROVEN | Public and original private repositories are pushed; complete local Git bundles were created, verified and checksummed outside the repositories. | Copy the bundle set to a second physical/cloud location for disaster recovery. |
| Lower Third Studio implementation | PROVEN | Template/layer editor, Preview/Take/Hide, package validation, runtime renderer and retained product screenshots are present. | Electron 43 source and packaged visible regression on PHL 243V7 before the next beta. |
| Lower-third codec behavior | PARTIAL | MP4/H.264 and WebM VP8/VP9 decode/runtime tests exist; internal alpha pixel tests passed on the earlier designated-display baseline. | External OBS/vMix alpha workflow remains uncertified. |
| Multi-output routing model | PROVEN | Exact-display identity, no-fallback behavior, fullscreen/window/custom/grid geometry and simultaneous route state have deterministic tests. | Physical multi-display source/packaged regression on PHL 243V7 and clean Windows hardware. |
| Operator UI and branding | PROVEN FOR CURRENT SCREENSHOTS | Responsive operator, Lower Third Studio and Output Routing screenshots plus the current icon/package identity are committed. | Repeat visible viewport matrix after the Electron 43 upgrade. |
| Localization | PARTIAL | English and Serbian are maintained as `FULL`; 35 packs are labelled `CORE`, use English fallback and retain RTL direction where required. | Native-language editorial review is required before any CORE pack is promoted to FULL. |
| Headless correctness | PROVEN | 93 deterministic checks run locally and in GitHub CI. | Headless tests do not replace visible or physical QA. |
| Native unsigned packaging | PROVEN | GitHub macOS and Windows runners build and inspect DMG, installer and portable artifacts; packaged ASAR checks pass on both platforms. | Current `main` has not been published as a new beta. |
| Public beta distribution | PROVEN | Beta 1 landing page, checksums, DMG, Windows installer and portable download are public. | Packages are unsigned and remain evaluation builds. |
| Stable signing automation | IMPLEMENTED | Candidate workflow verifies Developer ID/notarization and Authenticode/timestamps; publication is a separate exact-artifact evidence gate. | Signing secrets are not configured, so no signed stable candidate exists. |
| macOS stable release | PENDING | Local ad-hoc DMG/CLI/fuse checks pass. | Developer ID, notarization, signed-candidate clean install and Gatekeeper/multi-display evidence. |
| Windows stable release | PENDING | Native CI produces and inspects unsigned x64 packages. | Authenticode certificate, signed clean-machine installer/portable/firewall/multi-display/uninstall evidence. |
| External operator validation | PENDING | Public feedback channels exist. | At least one independent operator must complete a documented beta with zero open release blockers. |
| Adoption or sales result | NOT PROVEN | GitHub exposes aggregate asset counters only; they do not identify unique external users. | Recruit and document real operators; do not infer adoption from self-downloads or CI artifacts. |

## Current decision

`0.9.0-beta.1` is an honest public evaluation release. Current `main` is a stronger release candidate foundation, but it is not ready to be called stable or production-certified.

Do not publish the next beta until the current Electron 43 build passes source and packaged display regression on PHL 243V7. Do not publish a stable release until the signed draft candidate passes every machine-readable gate in [release-evidence](../release-evidence/README.md).

The public MIT decision supersedes the earlier proprietary-license plan for this repository. Do not reintroduce activation, trial watermarking or paid-license keys into this free build.
